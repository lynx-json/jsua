import createMediaTypePredicate from "./create-media-type-predicate";

export var registrations = [];

export function build(content) {
  if (!content) return Promise.reject(new Error("'content' param is required."));
  if (!content.blob) return Promise.reject(new Error("'content' object must have a 'blob' property."));
  if ("type" in content.blob === false) return Promise.reject(new Error("'content.blob' object must have a 'type' property."));
  if (registrations.length === 0) return Promise.reject(new Error("No builders have been registered."));
  
  var type = content.blob.type || "application/octet-stream";
  var registration = registrations.find(registration => registration.predicate(type));
  if (!registration) return Promise.reject(new Error("No builder registered for content type '" + type + "'"));
  
  return registration.builder(content).then(view => {
    return {
      content: content,
      view: view
    };
  });
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
