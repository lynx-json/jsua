export default function transfer(request) {
  var url = request.url.replace("data:", "");
  var delim = url.indexOf(",");
  var type, encoding;

  if (delim === 0) {
    type = "text/plain;charset=US-ASCII";
    encoding = "ascii";
  }
  else {
    type = url.substr(0, delim);
    if (type.indexOf(";base64") !== -1) {
      encoding = "base64";
      type = type.replace(";base64", "");
    }
  }

  var content = url.substr(delim + 1);
  encoding = encoding || "utf8";

  if (encoding === "utf8") {
    content = decodeURIComponent(content);
  }

  var data = new Buffer(content, encoding);
  request.blob = new Blob([data], { type: type });

  return Promise.resolve(request);
}
