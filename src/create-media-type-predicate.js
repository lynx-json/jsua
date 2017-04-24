const SPECIFICITY_TYPE_RANGE = 0;
const SPECIFICITY_SUBTYPE_RANGE = 1;
const SPECIFICITY_MEDIA_TYPE = 2;

export default function createMediaTypePredicate(mediaType) {
  if (!mediaType) throw new Error("'mediaType' param is required.");
  
  if (mediaType === "*/*") {
    let predicate = function () {
      return true;
    };
    predicate.specificity = SPECIFICITY_TYPE_RANGE;
    return predicate;
  }
  
  var rangePattern = /^([a-zA-Z0-9][a-zA-Z0-9!#$&-^_.+]*)\/\*(;|$)/;
  var mediaTypePattern = /^([a-zA-Z0-9][a-zA-Z0-9!#$&-^_.+]*)\/([a-zA-Z0-9\!\#\$\&\^\_\.\+\-]*)(;|$)/;
  
  var rangePatternMatch = rangePattern.exec(mediaType);
  if (rangePatternMatch) {
    let predicate = function (contentType) {
      var contentTypeMatch = mediaTypePattern.exec(contentType);
      if (!contentTypeMatch) return false;
      return contentTypeMatch[1] === rangePatternMatch[1];
    };
    
    predicate.specificity = SPECIFICITY_SUBTYPE_RANGE;
    
    return predicate;
  }
  
  var mediaTypeMatch = mediaTypePattern.exec(mediaType);
  if (!mediaTypeMatch) throw new Error("Unable to parse media type '" + mediaType + "'");
  
  var type = mediaTypeMatch[1];
  var subtype = mediaTypeMatch[2];
  
  let predicate = function (contentType) {
    var contentTypeMatch = mediaTypePattern.exec(contentType);
    if (!contentTypeMatch) return false;
    return contentTypeMatch[1] === type && contentTypeMatch[2] === subtype;
  };
  
  predicate.specificity = SPECIFICITY_MEDIA_TYPE;
  
  return predicate;
}
