export var registrations = [];

export function finish(result) {
  // TODO: implement the calling of all registered finishing functions
  return result;
}

export function register(name, finisher) {
  if (!name) throw new Error("'name' param is required.");
  if (!finisher) throw new Error("'finisher' param is required.");
  
  var newRegistration = { name, finisher };
  var oldRegistration = registrations.find(registration => registration.name === name);
  
  if (oldRegistration) {
    let index = registrations.indexOf(oldRegistration);
    registrations[index] = newRegistration;
  } else {
    registrations.push(newRegistration);
  }
}

export var platform;
