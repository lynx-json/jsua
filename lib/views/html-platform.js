"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAttached = isAttached;
exports.setRootView = setRootView;
exports.getRootView = getRootView;
exports.rootAttacher = rootAttacher;
exports.getAttachers = getAttachers;
exports.buildTextAsHtml = buildTextAsHtml;
exports.getBuilders = getBuilders;
var rootView = null;

function isAttached(view) {
  if (!view) throw new Error("'view' param is required.");
  return view.parentElement !== null;
}

function setRootView(view) {
  if (!view) throw new Error("'view' param is required.");
  rootView = view;
}

function getRootView() {
  return rootView;
}

function rootAttacher(result) {
  if (!rootView) return;

  while (rootView.firstElementChild) {
    rootView.removeChild(rootView.firstElementChild);
  }

  rootView.appendChild(result.view);
}

function getAttachers() {
  return [{
    name: "root",
    attacher: rootAttacher
  }];
}

function buildTextAsHtml(content) {
  return new Promise(function (resolve, reject) {
    var fileReader = new FileReader();

    fileReader.onloadend = function (evt) {
      var view = document.createElement("pre");
      view.textContent = evt.target.result;
      resolve(view);
    };

    fileReader.readAsText(content.blob);
  });
}

function getBuilders() {
  return [{
    mediaType: "text/*",
    builder: buildTextAsHtml
  }];
}