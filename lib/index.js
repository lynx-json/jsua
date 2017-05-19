"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetch = fetch;
exports.on = on;
exports.emit = emit;
exports.resolveURI = resolveURI;
exports.error = error;

var _messaging = require("./messaging");

var messaging = _interopRequireWildcard(_messaging);

var _transferring = require("./transferring");

var transferring = _interopRequireWildcard(_transferring);

var _views = require("./views");

var views = _interopRequireWildcard(_views);

var _url = require("url");

var urlModule = _interopRequireWildcard(_url);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function fetch(url, options) {
  return Promise.resolve({ url: url, options: options }).then(transferring.transfer).then(views.building.build).then(views.attaching.attach).then(views.finishing.finish);
}

function on(type, listener) {
  messaging.hub.on(type, listener);
}

function emit(type, evt) {
  messaging.hub.emit(type, evt);
}

function resolveURI(base, uri) {
  return urlModule.resolve(base, uri);
}

function error(err) {
  messaging.hub.emit("error", err);
}

// *** I THINK THIS STUFF BELONGS IN THE VIEWS MODULE ***

// var applicationElement = null;
// 
// app.getApplicationElement = function getApplicationElement() {
//   if (!applicationElement) throw new Error("Use the 'setApplicationElement' function to configure the application's root element.");
//   return applicationElement;
// };
// 
// app.setApplicationElement = function setApplicationElement(element) {
//   applicationElement = element;
// };
// 
// app.getLocation = function getLocation() {
//   var appElement = app.getApplicationElement();
//   
//   var contentElement = appElement.querySelector("[data-content-location]");
//   return contentElement && contentElement.dataset.contentLocation;
// };

// return app;