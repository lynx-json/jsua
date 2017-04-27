# jsua (PRELIMINARY DOCUMENTATION)

[![Build Status](https://travis-ci.org/lynx-json/jsua.svg?branch=master)](https://travis-ci.org/lynx-json/jsua)

A generic and embeddable user agent written in JavaScript.

## data-jsua-app

JSUA needs to know where its view hierarchy starts. To indicate the root view, add a `data-jsua-app` attribute to the root view and start JSUA by calling `fetch` and assigning `options.origin` to this view.

## fetch

The `fetch` function has the same interface as the `fetch` function in the web browser's API. It's behavior is different, however. The `fetch` function will invoke `transferring.transfer`, `building.build`, `attaching.attach`, and `finishing.finish` for each call it receives.

## transferring

The transferring object has the following interface:
* `register` - registers a transferrer function; accepts the following params:
  * `protocol` - the protocol the transferring function implements (e.g. 'http')
  * `transferrer` - the function that performs the transfer; accepts a `request` object param
* `registrations` - the registered transfer functions
* `transfer` - resolves the transferrer by protocol and invokes it

The `transfer` function is used to retrieve resources and has a similar signature to the HTML Fetch API, with the exception that the parameters are combined into a single `request` object:

* `url` - the URL of the targeted resource
* `options` - an object containing transferring options
  * `origin` - the view the user interacted with to initiate the fetch; if this is the first request, use the `data-jsua-app` view
  * `method` - the method of transferring
  * `headers` - headers to include in the transfer request
  * `body` - the body of the transfer request

The `transfer` function will delegate the call to a registered transfer function for the protocol scheme of the `url`. To register a transfer function for a given protocol, call the `register` function of the `transfer` function (e.g. `transfer.register("http", anHttpTransferFunction)`).

The `transfer` function returns a Promise for an object, called a "content object", having the following properties:

* `url` - the URL of the retrieved resource
* `blob` - a Blob containing the content of the retrieved resource
* `options` - the request options

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

## finishing

The `finishing` object has the following interface:
* `register` - registers a finisher function; accepts the following params:
  * `name` - a distinguishing name for the finisher
  * `finisher` - the function that finishes the view; accepts a build result param
* `registrations` - the registered finisher functions
* `finish` - invokes the finisher functions in registry order
