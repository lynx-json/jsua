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
        raiseEvent(detachedView, "jsua-detach", false);
        Array.from(detachedView.querySelectorAll("*")).forEach(detachedSubview => {
          raiseEvent(detachedSubview, "jsua-detach", false);
        });
      });
    }
    
    Array.from(result.view.querySelectorAll("*")).forEach(attachedSubview => {
      raiseEvent(attachedSubview, "jsua-attach", false);
    });
    
    raiseEvent(result.view, "jsua-attach", true);
    
    resolve(result);
  });
}

function raiseEvent(view, type, bubbles) {
  var changeEvent = document.createEvent("Event");
  changeEvent.initEvent(type, bubbles, false);
  view.dispatchEvent(changeEvent);
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
