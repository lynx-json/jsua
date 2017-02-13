var current;

export function set(platform) {
  if (!platform) throw new Error("'platform' param is required.");
  current = platform;
}

export function get() {
  return current;
}

export function isAttached(view) {
  return current.isAttached(view);
}

export function setRootView(view) {
  current.setRootView(view);
}

export function getRootView() {
  return current.getRootView();
}

export function getBuilders() {
  return current.getBuilders();
}

export function getAttachers() {
  return current.getAttachers();
}

export var registrations = [];

export function register(name, platform) {
  if (!name) throw new Error("'name' param is required.");
  if (!platform) throw new Error("'platform' param is required.");
  
  var newRegistration = { name, platform };
  var oldRegistration = registrations.find(registration => registration.name === name);
  
  if (oldRegistration) {
    let index = registrations.indexOf(oldRegistration);
    registrations[index] = newRegistration;
  } else {
    registrations.push(newRegistration);
  }
}
