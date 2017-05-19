"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registrations = undefined;
exports.build = build;
exports.register = register;

var _createMediaTypePredicate = require("./create-media-type-predicate");

var _createMediaTypePredicate2 = _interopRequireDefault(_createMediaTypePredicate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registrations = exports.registrations = [];

function build(content) {
  if (!content) return Promise.reject(new Error("'content' param is required."));
  if (!content.blob) return Promise.reject(new Error("'content' object must have a 'blob' property."));
  if (!content.blob.type) return Promise.reject(new Error("'content.blob' object must have a 'type' property."));
  if (registrations.length === 0) return Promise.reject(new Error("No builders have been registered."));

  var registration = registrations.find(function (registration) {
    return registration.predicate(content.blob.type);
  });
  if (!registration) return Promise.reject(new Error("No builder registered for content type '" + content.blob.type + "'"));

  return registration.builder(content).then(function (view) {
    return {
      content: content,
      view: view
    };
  });
}

function register(mediaType, builder) {
  if (!mediaType) throw new Error("'mediaType' param is required.");
  if (!builder) throw new Error("'builder' param is required.");

  var newRegistration = { mediaType: mediaType, builder: builder, predicate: (0, _createMediaTypePredicate2.default)(mediaType) };
  var oldRegistration = registrations.find(function (registration) {
    return registration.mediaType === mediaType;
  });

  if (oldRegistration) {
    var index = registrations.indexOf(oldRegistration);
    registrations[index] = newRegistration;
  } else {
    registrations.push(newRegistration);
  }

  var sorted = registrations.sort(function (x, y) {
    return x.predicate.specificity < y.predicate.specificity;
  });
  Array.prototype.splice.call(registrations, [0, registrations.length], sorted);
}