import * as media from "./media";
import * as transferring from "./transferring";
import * as building from "./building";
import * as attaching from "./attaching";
import * as finishing from "./finishing";
import urlModule from "url";

function defaultFetchFn(url, options) {
  options = options || {};
  var promiseForSameDocumentReferenceView = getPromiseForSameDocumentReferenceView(url, options);
  if (promiseForSameDocumentReferenceView) return promiseForSameDocumentReferenceView;

  return Promise.resolve({ url, options })
    .then(transferring.transfer)
    .then(building.build)
    .then(function (result) {
      result = attaching.attach(result);
      result = finishing.finish(result);
      return result;
    });
}

function getPromiseForSameDocumentReferenceView(url, options) {
  var appView = findAppViewFor(options.origin);
  var urlObj = urlModule.parse(url);

  if (isSameDocumentReference(appView, urlObj, options)) {
    var sameDocumentReferenceView = findSameDocumentReferenceView(appView, urlObj, options);
    if (sameDocumentReferenceView) {
      if (sameDocumentReferenceView === appView) {
        scrollAppViewToTop(appView);
      } else {
        sameDocumentReferenceView.setAttribute("data-jsua-focus", true);
        finishing.tryToSetFocus({ view: sameDocumentReferenceView });
      }

      return Promise.resolve({ view: sameDocumentReferenceView });
    }

    return Promise.resolve({ view: appView });
  }
}

var fetchFn = defaultFetchFn;

function fetch(url, options) {
  return fetchFn(url, options);
}

function getFetchFn() {
  return fetchFn;
}

function setFetchFn(newFetchFn) {
  if (typeof newFetchFn !== 'function') throw new Error('New fetch fn must be a function.');
  fetchFn = newFetchFn;
}

function isSameDocumentReference(appView, urlObj, options) {
  if (!appView) return false;
  if (!urlObj.hash) return false;

  return Array.from(appView.querySelectorAll("[data-content-url]"))
    .map(el => el.getAttribute("data-content-url"))
    .some(variesByFragmentOnly(urlObj));
}

function variesByFragmentOnly(urlObj) {
  return function (otherUrl) {
    if (!otherUrl) return false;

    var otherUrlObj = urlModule.parse(otherUrl);
    return otherUrlObj.protocol === urlObj.protocol &&
      otherUrlObj.host === urlObj.host &&
      otherUrlObj.path === urlObj.path;
  };
}

function findSameDocumentReferenceView(appView, urlObj, options) {
  if (urlObj.hash === "#") return appView;
  return appView.querySelector("[data-jsua-view-uri='" + urlObj.href + "']");
}

function scrollAppViewToTop(appView) {
  var firstScrollableView = Array.from(appView.querySelectorAll("*"))
    .find(el => el.style.overflowY === "scroll");

  if (firstScrollableView) {
    firstScrollableView.scrollTop = 0;
  }
}

function findAppViewFor(view) {
  if (!view) return;

  var current = view;

  while (current && current.matches("[data-jsua-context~=app]") === false) {
    current = current.parentElement;
  }

  return current;
}

transferring.register("https", transferring.http);
transferring.register("http", transferring.http);
transferring.register("data", transferring.data);

export {
  media,
  getPromiseForSameDocumentReferenceView,
  fetch,
  getFetchFn,
  setFetchFn,
  transferring,
  building,
  attaching,
  finishing
};
