# jsua (PRELIMINARY DOCUMENTATION)

[![Build Status](https://travis-ci.org/lynx-json/jsua.svg?branch=master)](https://travis-ci.org/lynx-json/jsua)

A generic and embeddable user agent written in JavaScript.

## data-jsua-context

The `data-jsua-context` attribute can be applied to any view to identify share view/presentation context information. The value of this property MUST be a space-delimited token list. This attribute is not required on all views with one exception. JSUA needs to know where the view hierarchy for the application begins. To indicate the root view for the application, add a `data-jsua-context` attribute to the root view containing the token `app`. To start JSUA, call `fetch` and assign `options.origin` a reference to this root view.

## data-jsua-view-uri

The `data-jsua-view-uri` attribute can be applied to any view to identify the view to JSUA in a uniform way. If applied, the value should be the view's context URI plus an additional fragment component to identify the view within the context document. If JSUA receives a fetch request for a URL with a fragment component that is a same-document reference, JSUA will attempt to find the targeted view by its `data-jsua-view-uri` attribute and focus it instead of performing a transfer.

## fetch

The `fetch` function has the same interface as the `fetch` function in the web browser's API. It's behavior is different, however. The `fetch` function will invoke `transferring.transfer`, `building.build`, `attaching.attach`, and `finishing.finish` for each call it receives.

## media

The `media` object has the following interface:
* `register` - registers media; accepts the following params:
  * `media` - a URL identifying the media (string)
  * `supports` - an optional function that accepts a `source` object parameter and returns `true` if the media supports the source or `false` if not (function)
* `registrations` - the registered media (array)
* `supports` - returns `true` if a media is registered that supports the source or `false` if not (function)

To register media, call the `register` function:

* `media.register("http://www.example.com/my-media");`
* `media.register("http://www.example.com/my-media", function (source) { return isThisSourceSupportedOnThisPlatform(source); });`

To test whether a source is supported:

* `var isSupported = media.supports({ media: "http://www.example.com/my-media" });`

The `source` param of the `supports` function is an object with the following interface:

* `media` - the target media for the content (string) - if empty or undefined, its value is presumed to be `screen`
* one of the following sets of content properties:
  * `src` - the URL of the content (string)
  * `type` - optional informative, but not authoritative, media type of the content (string)
  * -- or --
  * `data` - the content (string)
  * `type` - the authoritative media type of the content (string)
  * `encoding` - a value of `base64` or `utf-8` (the presumed value, if a value is not present) to indicate the encoding of the content in the `data` property (string)
* also, image content (image/*) may includes the following properties:
  * `width` - the natural width of the image
  * `height` - the natural height of the image
  * `scale` - the scale of the image which can be correlated to a screen's pixel density - for example, a screen with a pixel density of 2 (2 device pixels per pixel) would support an image with a scale of 2.
* also, sources may include any additional extended properties specific to the content.

## transferring

The transferring object has the following interface:
* `register` - registers a transferrer function; accepts the following params:
  * `protocol` - the protocol the transferring function implements (e.g. 'http')
  * `transferrer` - the function that performs the transfer; accepts a `request` object param
* `registrations` - the registered transfer functions
* `transfer` - resolves the transferrer by protocol and invokes it
* `addEventListener` - add a `start`, `end`, or `error` event listener
* `removeEventListener` - remove a `start`, `end`, or `error` event listener

The `transfer` function is used to retrieve resources and has a similar signature to the HTML Fetch API, with the exception that the parameters are combined into a single `request` object:

* `url` - the URL of the targeted resource
* `options` - an object containing transferring options
  * `origin` - the view the user interacted with to initiate the fetch; if this is the first request, use the `[data-jsua-context~=app]` view
  * `method` - the method of transferring
  * `headers` - headers to include in the transfer request
  * `body` - the body of the transfer request

The `transfer` function will delegate the call to a registered transfer function for the protocol scheme of the `url`. To register a transfer function for a given protocol, call the `register` function of the `transfer` function (e.g. `transfer.register("http", anHttpTransferFunction)`).

The `transfer` function returns a Promise for an object having the following properties:

* `url` - the URL of the retrieved resource
* `options` - the request options
* `blob` - a Blob containing the content of the retrieved resource

The event object passed to the `start`, `end`, and `error` transferring event listeners will have the following properties:

* `request` - the request object
* `result` - the transfer result (on `end`)
* `error` - the transfer error (on `error`)
* `pendingTransfers` - the count of pending transfers including this request (on `start`) or the count of pending transfers not including this result/error (on `end` and `error`)
  

## building

The `building` object has the following interface:
* `register` - registers a builder function; accepts the following params:
  * `mediaType` - the media type or media type range the builder function can create views for
  * `builder` - the function that builds the view from the content; accepts a content object param
* `registrations` - the registered builder functions
* `build` - resolves the builder by content type and invokes it

To register a builder function for a given media type, call the `register` function. For example:

* `building.register("text/plain", aTextPlainBuilderFunction);`
* `building.register("text/*", aTextAnyBuilderFunction);`
* `building.register("*/*", aGenericBuilderFunction)`

The `build` function returns a Promise for an object, called a "build result", having the following properties:

* `content` - the content object that was passed into builder
* `view` - an unattached view of the content

A builder function should set the following attributes on the resultant view:

* `data-content-url` - the context URI of the content in the view
* `data-content-type` - the media type of the content in the view

## attaching

The `attaching` object has the following interface:
* `register` - registers an attacher function; accepts the following params:
  * `name` - a distinguishing name for the attacher
  * `attacher` - the function that attaches the view to the view hierarchy; accepts a build result param
* `registrations` - the registered attacher functions
* `attach` - invokes the attacher functions in registry order until one returns a result

The return parameter of an attacher function must be:
* if the attacher cannot attach the view to the view hierarchy, the return parameter must be falsey
* if the attacher can attach the view to the view hierarchy, the return parameter must be an object matching one of the following two interfaces:

If the attacher determines that the view should be discarded:
* `discard` - `true` if the attacher determines the view should be discarded

If the attacher determines that the view should be attached:
* `attach` - a parameterless function that attaches the view to the view hierarchy; the return parameter is an array of the detached views, if any, or falsey.

TODO: document `jsua-attach` and `jsua-detach` events

## finishing

The `finishing` object has the following interface:
* `register` - registers a finisher function; accepts the following params:
  * `name` - a distinguishing name for the finisher
  * `finisher` - the function that finishes the view; accepts a build result param
  * `condition` - a function that returns `false` if the finisher should not be executed; accepts a build result param; this param is optional
* `registrations` - the registered finisher functions
* `finish` - invokes the finisher functions in registry order
