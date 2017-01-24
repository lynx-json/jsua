import http from "./http";
import data from "./data";
import * as urlModule from "url";

function transfer(request) {
  // url - the resource URI to send a message to
  // options.method   - the method to use for transferring
  // options.form     - the Form API object representing the form data submission
  //                    converted to a message body via encoding (see: options.enctype)
  // options.enctype  - the encoding to use to encode form into message body
  // options.body     - an already encoded message body
  //                    if both body and form are present, form is ignored
  if (!request) throw new Error("'request' param is required.");
  
  var url = request.url;
  var options = request.options;
  
  if (!url) throw new Error("'request.url' param is required.");
  
  var protocol = urlModule.parse(url).protocol;
  if (!protocol) throw new Error("'request.url' param must have a protocol scheme.");
  
  protocol = protocol.replace(":", "");
  if (protocol in transfer.transferrers === false) throw new Error("No transferrer registered for protocol: " + protocol);
  
  var transferrer = transfer.transferrers[protocol];
  return transferrer(request);
}

transfer.transferrers = {};
transfer.register = function registerTransferrer(scheme, transferrer) {
  transfer.transferrers[scheme] = transferrer;
};

transfer.register("http", http.transfer);
transfer.register("data", data.transfer);

export default { transfer };