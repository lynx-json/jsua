export var registrations = [];

export function register(name, finisher, condition) {
  if (!name) throw new Error("'name' param is required.");
  if (!finisher) throw new Error("'finisher' param is required.");
  if (typeof finisher !== "function" && Array.isArray(finisher) === false) throw new Error("'finisher' param must be a function or array.");
  if (condition && typeof condition !== "function") throw new Error("'condition' param must be a function.");

  if (typeof finisher === "function") finisher = [finisher];
  condition = condition || null;
  var newRegistration = { name, finisher, condition };
  var oldRegistration = registrations.find(registration => registration.name === name);

  if (oldRegistration) {
    let index = registrations.indexOf(oldRegistration);
    registrations[index] = newRegistration;
  } else {
    registrations.push(newRegistration);
  }
}

export function finish(result) {
  if (!result) throw new Error("'result' param is required.");
  if (!result.view) throw new Error("'result' object must have 'view' property.");
  if (!result.content) throw new Error("'result' object must have 'content' property.");

  registrations.forEach(registration => {
    if (registration.condition && registration.condition(result) === false) return;

    registration.finisher.forEach(finisher => {
      try {
        finisher(result);
      } catch (e) {
        console.log(`A non-critical error occurred in jsua/finishing for registrant '${registration.name}'.`, e);
      }
    });
  });

  exports.tryToSetFocus(result);

  return result;
}

export function tryToSetFocus(result) {
  var focusedViews = Array.from(result.view.querySelectorAll("[data-jsua-focus=true]"));
  if (result.view.matches("[data-jsua-focus=true]")) focusedViews.unshift(result.view);

  focusedViews.forEach((focusedView, idx) => {
    focusedView.removeAttribute("data-jsua-focus");
    if (idx !== 0) return;
    exports.setFocus(focusedView);
  });
}

export function setFocus(view) {
  if (!exports.isDisplayed(view)) exports.scrollIntoView(view);
  view.focus();
}

export function isDisplayed(view) {
  if (!view) return false;

  var rect = view.getBoundingClientRect();

  return rect.left >= 0 &&
    rect.left <= document.documentElement.clientWidth &&
    rect.top >= 0 &&
    rect.top <= document.documentElement.clientHeight;
}

function easeInOut(t, b, c, d) {
  return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
}

export function scrollIntoView(view) {
  if (!view) return;

  var parent = findScrollableParent(view);
  if (!parent) return;

  var frames = 30;
  var frame = 0;
  var scrollIntoViewTopMargin = 35;
  var start = parent.scrollTop - scrollIntoViewTopMargin;
  var change = view.getBoundingClientRect().top - parent.getBoundingClientRect().top;

  function step() {
    var moveTo = easeInOut(frame++, start, change, frames);
    parent.scrollTop = moveTo;
    if (frame !== frames) window.requestAnimationFrame(step);
  }

  window.requestAnimationFrame(step);
}

function findScrollableParent(view) {
  if (!view) return;

  var current = view.parentElement;

  while (!!current && current.matches("[data-jsua-context~=app]") === false) {
    if (current.style.overflowY === "scroll" || current.style.overflowY === "auto") return current;
    current = current.parentElement;
  }
}
