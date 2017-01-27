var rootView = null;

export function isAttached(view) {
  if (!view) throw new Error("'view' param is required.");
  return view.parentElement !== null;
}

export function setRootView(view) {
  if (!view) throw new Error("'view' param is required.");
  rootView = view;
}

export function getRootView() {
  return rootView;
}

function pageAttacher(result) {
  if (!rootView) return;
  
  while (rootView.firstElementChild) {
    rootView.removeChild(rootView.firstElementChild);
  }
  
  rootView.appendChild(result.view);
}

export var attachers = {
  page: pageAttacher
};

export function renderTextToHtml(content) {
  return new Promise(function (resolve, reject) {
    var fileReader = new FileReader();
    
    fileReader.onloadend = function (evt) {
      var view = document.createElement("pre");
      view.textContent = evt.target.result;
      var result = { content, view };
      resolve(result);
    };
    
    fileReader.readAsText(content.blob);
  });
}

export var renderers = {
  text: {
    mediaType: "text/*",
    renderer: renderTextToHtml
  }
};
