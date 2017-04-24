var _isAttached;

export function setIsAttached(isAttached) {
  _isAttached = isAttached;
}

export var registrations = [];

export function attach(result) {
  if (!result) return Promise.reject(new Error("'result' param is required."));
  if (!result.view) return Promise.reject(new Error("'result' object must have 'view' property."));
  if (!_isAttached) return Promise.reject(new Error("The 'isAttached' function has not been set via 'setIsAttached'."));
  if (registrations.length === 0) return Promise.reject(new Error("No attachers have been registered."));
  
  return new Promise((resolve, reject) => {
    registrations.forEach(registration => {
      if (_isAttached(result.view)) return;
      registration.attacher(result);
    });
    
    if (_isAttached(result.view) === false) {
      return reject(new Error("The view was unable to attach."));
    }
    
    resolve(result);
  });
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
