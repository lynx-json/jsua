import createMediaTypePredicate from "./create-media-type-predicate";

function render(content) {
  if (!content || !content.blob) throw new Error("'content' and 'content.blob' params are required.");
  
  var registration = render.registrations.find(registration => registration.predicate(content.blob.type));
  if (!registration) throw new Error("No renderer registered for content type '" + content.blob.type + "'");
  
  return registration.renderer(content);
}

render.registrations = [];

render.register = function registerRenderer(mediaType, renderer) {
  if (!mediaType) throw new Error("'mediaType' param is required.");
  if (!renderer) throw new Error("'renderer' param is required.");
  
  var registration = render.registrations.find(registration => registration.mediaType === mediaType);
  if (registration) {
    let index = render.registrations.indexOf(registration);
    render.registrations.splice(index, 1);
  }
  
  registration = { mediaType, renderer };
  registration.predicate = createMediaTypePredicate(mediaType);
  render.registrations.push(registration);
  
  var sorted = render.registrations.sort((x,y) => x.predicate.specificity < y.predicate.specificity);
  Array.prototype.splice.call(render.registrations, [0, render.registrations.length], sorted);
};



function attach(result) {
  // TODO: implement attachment for registered attachers
  return result;
}

attach.registrations = [];

attach.register = function registerAttacher(attacher) {
  attach.registrations.push(attacher);
};



export { render, attach };
