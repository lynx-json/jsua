import * as platforms from "./platforms";

export function attach(result) {
  if (!result) throw new Error("'result' param is required.");
  
  attach.registrations.forEach(registration => {
    if (platforms.get().isAttached(result.view)) return;
    registration.attacher(result);
  });
  
  if (platforms.get().isAttached(result.view) === false) {
    throw new Error("The view was unable to attach.");
  }
  
  return result;
}

attach.registrations = [];

attach.register = function registerAttacher(name, attacher) {
  if (!name) throw new Error("'name' param is required.");
  if (!attacher) throw new Error("'attacher' param is required.");
  
  var newRegistration = { name, attacher };
  var oldRegistration = attach.registrations.find(registration => registration.name === name);
  
  if (oldRegistration) {
    let index = attach.registrations.indexOf(oldRegistration);
    attach.registrations[index] = newRegistration;
  } else {
    attach.registrations.push(newRegistration);
  }
};
