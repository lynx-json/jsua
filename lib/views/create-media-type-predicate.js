"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createMediaTypePredicate;
var SPECIFICITY_TYPE_RANGE = 0;
var SPECIFICITY_SUBTYPE_RANGE = 1;
var SPECIFICITY_MEDIA_TYPE = 2;

function createMediaTypePredicate(mediaType) {
  if (!mediaType) throw new Error("'mediaType' param is required.");

  if (mediaType === "*/*") {
    var _predicate = function _predicate() {
      return true;
    };
    _predicate.specificity = SPECIFICITY_TYPE_RANGE;
    return _predicate;
  }

  var rangePattern = /^([a-zA-Z0-9][a-zA-Z0-9!#$&-^_.+]*)\/\*(;|$)/;
  var mediaTypePattern = /^([a-zA-Z0-9][a-zA-Z0-9!#$&-^_.+]*)\/([a-zA-Z0-9\!\#\$\&\^\_\.\+\-]*)(;|$)/;

  var rangePatternMatch = rangePattern.exec(mediaType);
  if (rangePatternMatch) {
    var _predicate2 = function _predicate2(contentType) {
      var contentTypeMatch = mediaTypePattern.exec(contentType);
      if (!contentTypeMatch) return false;
      return contentTypeMatch[1] === rangePatternMatch[1];
    };

    _predicate2.specificity = SPECIFICITY_SUBTYPE_RANGE;

    return _predicate2;
  }

  var mediaTypeMatch = mediaTypePattern.exec(mediaType);
  if (!mediaTypeMatch) throw new Error("Unable to parse media type '" + mediaType + "'");

  var type = mediaTypeMatch[1];
  var subtype = mediaTypeMatch[2];

  var predicate = function predicate(contentType) {
    var contentTypeMatch = mediaTypePattern.exec(contentType);
    if (!contentTypeMatch) return false;
    return contentTypeMatch[1] === type && contentTypeMatch[2] === subtype;
  };

  predicate.specificity = SPECIFICITY_MEDIA_TYPE;

  return predicate;
}