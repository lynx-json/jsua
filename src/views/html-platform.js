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

export function rootAttacher(result) {
  if (!rootView) return;
  
  while (rootView.firstElementChild) {
    rootView.removeChild(rootView.firstElementChild);
  }
  
  rootView.appendChild(result.view);
}

export function getAttachers() {
  return [
    {
      name: "root",
      attacher: rootAttacher
    }
  ];
}

export function buildTextAsHtml(content) {
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

export function getBuilders() {
  return [
    {
      mediaType: "text/*",
      builder: buildTextAsHtml
    }
  ];
}
