export var registrations = [];

export function attach(result) {
  if (!result) return Promise.reject(new Error("'result' param is required."));
  if (!result.view) return Promise.reject(new Error("'result' object must have 'view' property."));
  if (registrations.length === 0) return Promise.reject(new Error("No attachers have been registered."));
  
  return new Promise((resolve, reject) => {
    var attachment = registrations.reduce((prev, registration) => {
      if (prev) return prev;
      
      var attacherResult = registration.attacher(result);
      if (!attacherResult) return;
      
      return {
        registration,
        result: attacherResult
      };
    }, null);
    
    if (!attachment) {
      return reject(new Error("No attachment available for view."));
    }
    
    if (attachment.result.discard) {
      var err = new Error("The view was discarded by '" + attachment.registration.name + "'.");
      err.viewDiscarded = true;
      return reject(err);
    }
    
    var detachedViews = attachment.result.attach();
    
    if (detachedViews) {
      detachedViews.forEach(detachedView => {
        console.log("View detached", detachedView);
      });
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
