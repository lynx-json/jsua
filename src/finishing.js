export var registrations = [];

export function finish(result) {
  if (!result) throw new Error("'result' param is required.");
  if (!result.view) throw new Error("'result' object must have 'view' property.");
  if (!result.content) throw new Error("'result' object must have 'content' property.");
  
  registrations.forEach(registration => {
    if (registration.condition && registration.condition(result) === false) return;
    
    if (typeof registration.finisher === "function") {
      registration.finisher(result);
    } else if (Array.isArray(registration.finisher)) {
      registration.finisher.forEach(finisher => finisher(result));
    }
  });
  
  var focusedViews = Array.from(result.view.querySelectorAll("[data-jsua-focus=true]"));
  if (result.view.matches("[data-jsua-focus=true]")) focusedViews.unshift(result.view);
  
  focusedViews.forEach( (focusedView, idx) => {
    focusedView.removeAttribute("data-jsua-focus");
    if (idx !== 0) return;
    document.body.scrollTop = focusedView.offsetHeight;
    focusedView.focus();
  });
  
  return result;
}

export function register(name, finisher, condition) {
  if (!name) throw new Error("'name' param is required.");
  if (!finisher) throw new Error("'finisher' param is required.");
  if (condition && typeof condition !== "function") throw new Error("'condition' param must be a function.");
  
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

export var platform;
