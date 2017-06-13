import * as urlModule from "url";
import http from "./http";
import data from "./data";
var pendingTransfers = 0;
export var registrations = [];

export function transfer(request) {
  if (!request) return Promise.reject(new Error("'request' param is required."));
  if (!request.url) return Promise.reject(new Error("'request' object must have 'url' property."));
  if (registrations.length === 0) return Promise.reject(new Error("No transferrers have been registered."));

  var url = request.url;
  request.options = request.options || {};
  request.options.startedAt = new Date();
  var protocol = urlModule.parse(url).protocol;
  if (!protocol) return Promise.reject(new Error("'request.url' param must have a protocol scheme."));

  protocol = protocol.replace(":", "");
  var registration = registrations.find(registration => registration.protocol === protocol);
  if (!registration) return Promise.reject(new Error("No transferrer registered for protocol: " + protocol));

  var appView = exports.findAppView(request.options.origin);
  exports.raiseTransferringStartedEvent(appView, request.options.origin);

  return registration.transferrer(request)
    .then(function (result) {
      exports.raiseTransferringEndedEvent(appView, request.options.origin);
      return result;
    })
    .catch(function (err) {
      exports.raiseTransferringEndedEvent(appView, request.options.origin);
      throw err;
    });
}

export function findAppView(originView) {
  if (!originView) return;
  if (originView.matches("[data-jsua-context~=app]")) return originView;
  
  var currentView = originView.parentElement;
  
  do {
    if (currentView.matches("[data-jsua-context~=app]")) return currentView;
    currentView = currentView.parentElement;
  } while (currentView && currentView !== document);
}

export function raiseTransferringStartedEvent(appView, originView) {
  pendingTransfers = pendingTransfers + 1;
  raiseTransferringEvent(appView, originView, "jsua-transferring-started");
}

export function raiseTransferringEndedEvent(appView, originView) {
  pendingTransfers = pendingTransfers - 1;
  raiseTransferringEvent(appView, originView, "jsua-transferring-ended");
}

function raiseTransferringEvent(appView, originView, type) {
  if (!appView) return;
  var transferringEvent = document.createEvent("Event");
  transferringEvent.initEvent(type, true, false);
  transferringEvent.originView = originView;
  transferringEvent.pendingTransfers = pendingTransfers;
  appView.dispatchEvent(transferringEvent);
}

export function register(protocol, transferrer) {
  if (!protocol) throw new Error("'protocol' param is required.");
  if (!transferrer) throw new Error("'transferrer' param is required.");

  var newRegistration = { protocol, transferrer };
  var oldRegistration = registrations.find(registration => registration.protocol === protocol);

  if (oldRegistration) {
    let index = registrations.indexOf(oldRegistration);
    registrations[index] = newRegistration;
  } else {
    registrations.push(newRegistration);
  }
}

export { http, data };
