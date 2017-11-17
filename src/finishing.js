export var registrations = [];

export function register(name, finisher, condition) {
  if (!name) throw new Error("'name' param is required.");
  if (!finisher) throw new Error("'finisher' param is required.");
  if (typeof finisher !== "function" && Array.isArray(finisher) === false) throw new Error("'finisher' param must be a function or array.");
  if (condition && typeof condition !== "function") throw new Error("'condition' param must be a function.");

  if (typeof finisher === "function") finisher = [ finisher ];
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
    focusedView.scrollIntoView();
    focusedView.focus();
  });
}

export var platform;
