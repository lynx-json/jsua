import * as messaging from "./messaging";
import * as transferring from "./transferring";
import * as views from "./views";
import * as urlModule from "url";

export function fetch(url, options) {
  return Promise.resolve({ url, options })
    .then(transferring.transfer)
    .then(views.build)
    .then(views.attach)
    .then(views.finish);
}

export function on(type, listener) {
  messaging.hub.on(type, listener);
}

export function emit(type, evt) {
  messaging.hub.emit(type, evt);
}

export function resolveURI(base, uri) {
  return urlModule.resolve(base, uri);
}

export function error(err) {
  messaging.hub.emit("error", err);
}

// *** I THINK THIS STUFF BELONGS IN THE VIEWS MODULE ***

  // var applicationElement = null;
  // 
  // app.getApplicationElement = function getApplicationElement() {
  //   if (!applicationElement) throw new Error("Use the 'setApplicationElement' function to configure the application's root element.");
  //   return applicationElement;
  // };
  // 
  // app.setApplicationElement = function setApplicationElement(element) {
  //   applicationElement = element;
  // };
  // 
  // app.getLocation = function getLocation() {
  //   var appElement = app.getApplicationElement();
  //   
  //   var contentElement = appElement.querySelector("[data-content-location]");
  //   return contentElement && contentElement.dataset.contentLocation;
  // };
  
  // return app;
