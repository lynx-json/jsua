function transfer(request) {
  return fetch(request.url, request.options)
    .then(function (response) {
      return response.blob();
    }).then(function (blob) {
      return {
        url: request.url,
        blob: blob
      };
    });
}

export { transfer };
