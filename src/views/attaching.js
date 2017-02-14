var platform;
export var registrations = [];

export function setPlatform(plaf) {
  platform = plaf;
}

export function attach(result) {
  if (!result) throw new Error("'result' param is required.");
  
  registrations.forEach(registration => {
    if (platform.isAttached(result.view)) return;
    registration.attacher(result);
  });
  
  if (platform.isAttached(result.view) === false) {
    throw new Error("The view was unable to attach.");
  }
  
  return result;
}

export function register(name, attacher) {
  if (!name) throw new Error("'name' param is required.");
  if (!attacher) throw new Error("'attacher' param is required.");
  
  var newRegistration = { name, attacher };
  var oldRegistration = registrations.find(registration => registration.name === name);
  
  if (oldRegistration) {
    let index = registrations.indexOf(oldRegistration);
    registrations[index] = newRegistration;
  } else {
    registrations.push(newRegistration);
  }
}
