export var registrations = [];

export function supports(source) {
  if (!source) throw new Error("'source' param is required.");
  if (typeof source !== "object") throw new Error("'source' param must be an object.");
  
  source.media = source.media || "screen";
  var registration = registrations.find(registration => registration.media === source.media);
  
  if (!registration) {
    return false;
  } else if (registration.supports) {
    return registration.supports(source);
  }
  
  return true;
}

export function register(media, supports) {
  if (!media) throw new Error("'media' param is required.");
  if (typeof media !== "string") throw new Error("'media' param must be a string.");
  if (supports && typeof supports !== "function") throw new Error("when specified, 'supports' param must be a function.");
  
  var newRegistration = { media, supports };
  var oldRegistration = registrations.find(registration => registration.media === media);
  
  if (oldRegistration) {
    let index = registrations.indexOf(oldRegistration);
    registrations[index] = newRegistration;
  } else {
    registrations.push(newRegistration);
  }
}

register("screen", function (source) {
  var scale = source.scale || 1;
  
  if (scale > 1) {
    if (!window || !window.devicePixelRatio) return false;
    return scale <= window.devicePixelRatio;
  }
  
  return true;
});
