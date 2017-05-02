import * as urlModule from "url";
import http from "./http";
import data from "./data";

export var registrations = [];

export function transfer(request) {
  if (!request) return Promise.reject(new Error("'request' param is required."));
  if (!request.url) return Promise.reject(new Error("'request' object must have 'url' property."));
  if (registrations.length === 0) return Promise.reject(new Error("No transferrers have been registered."));
  
  var url = request.url;
  var options = request.options;
  var protocol = urlModule.parse(url).protocol;
  if (!protocol) return Promise.reject(new Error("'request.url' param must have a protocol scheme."));
  
  protocol = protocol.replace(":", "");
  var registration = registrations.find(registration => registration.protocol === protocol);
  if (!registration) return Promise.reject(new Error("No transferrer registered for protocol: " + protocol));
  
  return registration.transferrer(request);
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
