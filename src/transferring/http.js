export function transfer(request) {
  return fetch(request.url, request.options)
    .then(function (response) {
      return response.blob();
    }).then(function (blob) {
      request.blob = blob;
      return request;
    });
}
