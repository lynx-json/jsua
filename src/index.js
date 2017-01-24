import messaging from "./messaging";
import transferring from "./transferring";
import views from "./views";
import finishing from "./finishing";
import * as urlModule from "url";

export function fetch(url, options) {
  return Promise.resolve({ url, options })
    .then(transferring.transfer)
    .then(views.render)
    .then(views.attach)
    .then(finishing.finish);
}

export function on(type, listener) {
  messaging.on(type, listener);
}

export function emit(type, evt) {
  messaging.emit(type, evt);
}

export var modules = {
  messaging,
  transferring,
  views,
  finishing
};

export function resolveURI(base, uri) {
  return urlModule.resolve(base, uri);
}

export function error(err) {
  messaging.emit("error", err);
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
