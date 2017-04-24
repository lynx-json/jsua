export var registrations = [];

export function finish(result) {
  if (!result) throw new Error("'result' param is required.");
  if (!result.view) throw new Error("'result' object must have 'view' property.");
  if (!result.content) throw new Error("'result' object must have 'content' property.");
  
  registrations.forEach(registration => registration.finisher(result));
  
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
