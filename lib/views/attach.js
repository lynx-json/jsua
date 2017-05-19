"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attach = attach;

var _platforms = require("./platforms");

var platforms = _interopRequireWildcard(_platforms);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function attach(result) {
  if (!result) throw new Error("'result' param is required.");

  attach.registrations.forEach(function (registration) {
    if (platforms.get().isAttached(result.view)) return;
    registration.attacher(result);
  });

  if (platforms.get().isAttached(result.view) === false) {
    throw new Error("The view was unable to attach.");
  }

  return result;
}

attach.registrations = [];

attach.register = function registerAttacher(name, attacher) {
  if (!name) throw new Error("'name' param is required.");
  if (!attacher) throw new Error("'attacher' param is required.");

  var newRegistration = { name: name, attacher: attacher };
  var oldRegistration = attach.registrations.find(function (registration) {
    return registration.name === name;
  });

  if (oldRegistration) {
    var index = attach.registrations.indexOf(oldRegistration);
    attach.registrations[index] = newRegistration;
  } else {
    attach.registrations.push(newRegistration);
  }
};