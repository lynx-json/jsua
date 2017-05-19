"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registrations = undefined;
exports.transfer = transfer;
exports.register = register;

var _http = require("./http");

var http = _interopRequireWildcard(_http);

var _data = require("./data");

var data = _interopRequireWildcard(_data);

var _url = require("url");

var urlModule = _interopRequireWildcard(_url);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var registrations = exports.registrations = [];

function transfer(request) {
  if (!request) return Promise.reject(new Error("'request' param is required."));
  if (!request.url) return Promise.reject(new Error("'request' object must have 'url' property."));
  if (registrations.length === 0) return Promise.reject(new Error("No transferrers have been registered."));

  var url = request.url;
  var options = request.options;
  var protocol = urlModule.parse(url).protocol;
  if (!protocol) return Promise.reject(new Error("'request.url' param must have a protocol scheme."));

  protocol = protocol.replace(":", "");
  var registration = registrations.find(function (registration) {
    return registration.protocol === protocol;
  });
  if (!registration) return Promise.reject(new Error("No transferrer registered for protocol: " + protocol));

  return registration.transferrer(request);
}

function register(protocol, transferrer) {
  if (!protocol) throw new Error("'protocol' param is required.");
  if (!transferrer) throw new Error("'transferrer' param is required.");

  var newRegistration = { protocol: protocol, transferrer: transferrer };
  var oldRegistration = registrations.find(function (registration) {
    return registration.protocol === protocol;
  });

  if (oldRegistration) {
    var index = registrations.indexOf(oldRegistration);
    registrations[index] = newRegistration;
  } else {
    registrations.push(newRegistration);
  }
}

register("https", http.transfer);
register("http", http.transfer);
register("data", data.transfer);