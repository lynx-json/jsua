"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set = set;
exports.get = get;
exports.isAttached = isAttached;
exports.setRootView = setRootView;
exports.getRootView = getRootView;
exports.getBuilders = getBuilders;
exports.getAttachers = getAttachers;
exports.register = register;
var current;

function set(platform) {
  if (!platform) throw new Error("'platform' param is required.");
  current = platform;
}

function get() {
  return current;
}

function isAttached(view) {
  return current.isAttached(view);
}

function setRootView(view) {
  current.setRootView(view);
}

function getRootView() {
  return current.getRootView();
}

function getBuilders() {
  return current.getBuilders();
}

function getAttachers() {
  return current.getAttachers();
}

var registrations = exports.registrations = [];

function register(name, platform) {
  if (!name) throw new Error("'name' param is required.");
  if (!platform) throw new Error("'platform' param is required.");

  var newRegistration = { name: name, platform: platform };
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