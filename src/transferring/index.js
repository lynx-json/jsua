import * as http_data from "./http-data";
import * as urlModule from "url";

function transfer(request) {
  if (!request) throw new Error("'request' param is required.");
  
  var url = request.url;
  var options = request.options;
  
  if (!url) throw new Error("'request.url' param is required.");
  
  var protocol = urlModule.parse(url).protocol;
  if (!protocol) throw new Error("'request.url' param must have a protocol scheme.");
  
  protocol = protocol.replace(":", "");
  if (protocol in transfer.registrations === false) throw new Error("No transferrer registered for protocol: " + protocol);
  
  var transferrer = transfer.registrations[protocol];
  return transferrer(request);
}

transfer.registrations = {};

transfer.register = function registerTransferrer(protocol, transferrer) {
  transfer.registrations[protocol] = transferrer;
};

transfer.register("https", http_data.transfer);
transfer.register("http", http_data.transfer);
transfer.register("data", http_data.transfer);

export { transfer };
