"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;

var _createMediaTypePredicate = require("./create-media-type-predicate");

var _createMediaTypePredicate2 = _interopRequireDefault(_createMediaTypePredicate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function build(content) {
  if (!content || !content.blob) throw new Error("'content' and 'content.blob' params are required.");

  var registration = build.registrations.find(function (registration) {
    return registration.predicate(content.blob.type);
  });
  if (!registration) throw new Error("No builder registered for content type '" + content.blob.type + "'");

  return registration.builder(content);
}

build.registrations = [];

build.register = function registerBuilder(mediaType, builder) {
  if (!mediaType) throw new Error("'mediaType' param is required.");
  if (!builder) throw new Error("'builder' param is required.");

  var newRegistration = { mediaType: mediaType, builder: builder, predicate: (0, _createMediaTypePredicate2.default)(mediaType) };
  var oldRegistration = build.registrations.find(function (registration) {
    return registration.mediaType === mediaType;
  });

  if (oldRegistration) {
    var index = build.registrations.indexOf(oldRegistration);
    build.registrations[index] = newRegistration;
  } else {
    build.registrations.push(newRegistration);
  }

  var sorted = build.registrations.sort(function (x, y) {
    return x.predicate.specificity < y.predicate.specificity;
  });
  Array.prototype.splice.call(build.registrations, [0, build.registrations.length], sorted);
};