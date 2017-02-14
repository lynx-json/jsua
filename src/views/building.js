import createMediaTypePredicate from "./create-media-type-predicate";

var platform;
export var registrations = [];

export function setPlatform(plaf) {
  platform = plaf;
}

export function build(content) {
  if (!content || !content.blob) throw new Error("'content' and 'content.blob' params are required.");
  
  var registration = registrations.find(registration => registration.predicate(content.blob.type));
  if (!registration) throw new Error("No builder registered for content type '" + content.blob.type + "'");
  
  return registration.builder(content);
}

export function register(mediaType, builder) {
  if (!mediaType) throw new Error("'mediaType' param is required.");
  if (!builder) throw new Error("'builder' param is required.");
  
  var newRegistration = { mediaType, builder, predicate: createMediaTypePredicate(mediaType) };
  var oldRegistration = registrations.find(registration => registration.mediaType === mediaType);
  
  if (oldRegistration) {
    let index = registrations.indexOf(oldRegistration);
    registrations[index] = newRegistration;
  } else {
    registrations.push(newRegistration);
  }
  
  var sorted = registrations.sort((x,y) => x.predicate.specificity < y.predicate.specificity);
  Array.prototype.splice.call(registrations, [0, registrations.length], sorted);
}
