import createMediaTypePredicate from "./create-media-type-predicate";

export function build(content) {
  if (!content || !content.blob) throw new Error("'content' and 'content.blob' params are required.");
  
  var registration = build.registrations.find(registration => registration.predicate(content.blob.type));
  if (!registration) throw new Error("No builder registered for content type '" + content.blob.type + "'");
  
  return registration.builder(content);
}

build.registrations = [];

build.register = function registerBuilder(mediaType, builder) {
  if (!mediaType) throw new Error("'mediaType' param is required.");
  if (!builder) throw new Error("'builder' param is required.");
  
  var newRegistration = { mediaType, builder, predicate: createMediaTypePredicate(mediaType) };
  var oldRegistration = build.registrations.find(registration => registration.mediaType === mediaType);
  
  if (oldRegistration) {
    let index = build.registrations.indexOf(oldRegistration);
    build.registrations[index] = newRegistration;
  } else {
    build.registrations.push(newRegistration);
  }
  
  var sorted = build.registrations.sort((x,y) => x.predicate.specificity < y.predicate.specificity);
  Array.prototype.splice.call(build.registrations, [0, build.registrations.length], sorted);
};
