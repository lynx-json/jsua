# jsua (PRELIMINARY DOCUMENTATION)

A generic and embeddable user agent written in JavaScript.

## transferring

The transferring subpackage exports an object with a `transfer` function.

The `transfer` function is used to retrieve resources and has a similar signature to the HTML Fetch API, with the exception that the parameters are combined into a single object parameter:

* `url` - the URL of the targeted resource
* `options` - an object containing transferring options
  * `method` - the method of transferring
  * `headers` - headers to include in the transfer request
  * `body` - the body of the transfer request

The `transfer` function will delegate the call to a registered transfer function for the protocol scheme of the `url`. To register a transfer function for a given protocol, call the `register` function of the `transfer` function (e.g. `transfer.register("http", anHttpTransferFunction)`).

The `transfer` function returns a Promise for an object, called a content object, having the following properties:

* `url` - the URL of the retrieved resource
* `blob` - a Blob containing the content of the retrieved resource

## views

The views subpackage exports an object with the following properties:

* `building` subpackage
* `attaching` subpackage
* `finishing` subpackage

The `building.build` function is used to create a view for any given content object. It accepts a single parameter which is the content object for which to build a view. The `building.build` function will delegate the call to a registered builder function for the media type of the content (`content.blob.type`). To register a builder function for a given media type, call the `building.register` function. For example:

* `building.register("text/plain", aTextPlainBuilderFunction);`
* `building.register("text/*", aTextAnyBuilderFunction);`
* `building.register("*/*", aGenericBuilderFunction)`

The `building.build` function returns a Promise for an object having the following properties:

* `content` - the content object that was passed into builder
* `view` - an unattached view of the content

The `attaching.attach` function is used to attach a view to a view hierarchy. It accepts a single parameter which has the same interface as the return parameter of the `building.build` function. The `attaching.attach` function will delegate the call to the registered attach functions in the order they are registered until the view is attached. After the view is attached, the `attaching.attach` function will return. The return parameter has the same interface as the input parameter.
