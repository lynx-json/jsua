export var registrations = [];

export function attach(result) {
  if (!result) return Promise.reject(new Error("'result' param is required."));
  if (!result.view) return Promise.reject(new Error("'result' object must have 'view' property."));
  if (registrations.length === 0) return Promise.reject(new Error("No attachers have been registered."));
  
  return new Promise((resolve, reject) => {
    var attached = registrations.some(registration => {
      var detachedViews = registration.attacher(result);
      return detachedViews;
    });
    
    if (!attached) {
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
