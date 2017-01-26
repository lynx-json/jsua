import createMediaTypePredicate from "./create-media-type-predicate";

function render(content) {
  // TODO: implement rendering for registered renderers based on content.type
  return {
    content,
    element: {}
  };
}

var renderers = [];
render.register = function registerRenderer(mediaType, renderer) {
  var registration = { mediaType, renderer };
  registration.predicate = createMediaTypePredicate(mediaType);
  renderers.push(registration);
  renderers = renderers.sort((x,y) => x.predicate.specificity < y.predicate.specificity);
};



function attach(result) {
  // TODO: implement attachment for registered attachers
  return result;
}

const attachers = [];
attach.register = function registerAttacher(priority, attacher) {
  attachers.push({ priority, attacher });
};



export { render, attach };
