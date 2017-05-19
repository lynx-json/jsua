"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.finish = finish;
function finish(result) {
  // TODO: implement the calling of all registered finishing functions
  return result;
}

finish.registrations = [];

finish.register = function registerFinisher(name, finisher) {
  if (!name) throw new Error("'name' param is required.");
  if (!finisher) throw new Error("'finisher' param is required.");

  var newRegistration = { name: name, finisher: finisher };
  var oldRegistration = finish.registrations.find(function (registration) {
    return registration.name === name;
  });

  if (oldRegistration) {
    var index = finish.registrations.indexOf(oldRegistration);
    finish.registrations[index] = newRegistration;
  } else {
    finish.registrations.push(newRegistration);
  }
};