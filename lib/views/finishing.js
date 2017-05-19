"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.finish = finish;
exports.register = register;
var registrations = exports.registrations = [];

function finish(result) {
  if (!result) throw new Error("'result' param is required.");
  if (!result.view) throw new Error("'result' object must have 'view' property.");
  if (!result.content) throw new Error("'result' object must have 'content' property.");

  registrations.forEach(function (registration) {
    return registration.finisher(result);
  });

  return result;
}

function register(name, finisher) {
  if (!name) throw new Error("'name' param is required.");
  if (!finisher) throw new Error("'finisher' param is required.");

  var newRegistration = { name: name, finisher: finisher };
  var oldRegistration = registrations.find(function (registration) {
    return registration.name === name;
  });

  if (oldRegistration) {
    var index = registrations.indexOf(oldRegistration);
    registrations[index] = newRegistration;
  } else {
    registrations.push(newRegistration);
  }
}

var platform = exports.platform = undefined;