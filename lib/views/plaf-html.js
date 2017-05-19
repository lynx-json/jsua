"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAttached = isAttached;
exports.setRootView = setRootView;
exports.getRootView = getRootView;
exports.renderTextToHtml = renderTextToHtml;
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

function pageAttacher(result) {
  if (!rootView) return;

  while (rootView.firstElementChild) {
    rootView.removeChild(rootView.firstElementChild);
  }

  rootView.appendChild(result.view);
}

var attachers = exports.attachers = {
  page: pageAttacher
};

function renderTextToHtml(content) {
  return new Promise(function (resolve, reject) {
    var fileReader = new FileReader();

    fileReader.onloadend = function (evt) {
      var view = document.createElement("pre");
      view.textContent = evt.target.result;
      var result = { content: content, view: view };
      resolve(result);
    };

    fileReader.readAsText(content.blob);
  });
}

var renderers = exports.renderers = {
  text: {
    mediaType: "text/*",
    renderer: renderTextToHtml
  }
};