function transfer(request) {
  // TODO: implement transferring for HTTP protocol
  return { url: request.url, type: "", data: "http" };
}

export { transfer };
