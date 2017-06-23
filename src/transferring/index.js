import * as urlModule from "url";
import http from "./http";
import data from "./data";
import { EventEmitter } from "events";

var pendingTransfers = 0;
var eventHub = new EventEmitter();

function incrementPendingTransfers() {
  return ++pendingTransfers;
}

function decrementPendingTransfers() {
  return --pendingTransfers;
}

export var registrations = [];

export function addEventListener(eventName, listener) {
  eventHub.addListener(eventName, listener);  
}

export function removeEventListener(eventName, listener) {
  eventHub.removeListener(eventName, listener);
}

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

  exports.raiseTransferringStartedEvent(request);

  return registration.transferrer(request)
    .then(function (result) {
      exports.raiseTransferringEndedEvent(request, result);
      return result;
    })
    .catch(function (err) {
      exports.raiseTransferringErrorEvent(request, err);
      throw err;
    });
}

export function raiseTransferringStartedEvent(request) {
  var countOfPendingTransfers = incrementPendingTransfers();
  
  var eventObj = {
    request: request,
    pendingTransfers: countOfPendingTransfers
  };
  
  eventHub.emit("start", eventObj);
}

export function raiseTransferringEndedEvent(request, result) {
  var countOfPendingTransfers = decrementPendingTransfers();
  
  var eventObj = {
    request: request,
    pendingTransfers: countOfPendingTransfers,
    result: result
  };
  
  eventHub.emit("end", eventObj);
}

export function raiseTransferringErrorEvent(request, err) {
  var countOfPendingTransfers = decrementPendingTransfers();
  
  var eventObj = {
    request: request,
    pendingTransfers: countOfPendingTransfers,
    error: err
  };
  
  eventHub.emit("error", eventObj);
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
