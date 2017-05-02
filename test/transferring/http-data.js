var http = require("../../dist/transferring/http").default;
var data = require("../../dist/transferring/data").default;
var chai = require("chai");
var should = chai.should();

// mock the fetch API
global.fetch = function () {
  return Promise.resolve(mockResponse);
};

var mockResponse = {
  blob: function () {
    return Promise.resolve(mockBlob);
  }
};

var mockBlob = { type: "text/plain" };

function Blob(data, options) {
  this.data = data[0];
  this.type = options.type;
}

global.Blob = Blob;

describe("transferring / http", function () {
  it("should resolve when request param is valid", function () {
    let expected = { url: "http://example.com/", blob: mockBlob };
    
    http({ url: "http://example.com/" }).then(function (content) {
      content.url.should.equal(expected.url);
    });
  });
});

describe("transferring / data", function () {
  it("should resolve UTF-8 data", function () {
    let url = "data:text/plain,Hi";
    
    data({ url: url }).then(function (content) {
      content.url.should.equal(url);
      content.blob.data.toString().should.equal("Hi");
      content.blob.type.should.equal("text/plain");
    });
  });
  
  it("should resolve Base64 data", function () {
    let url = "data:text/plain;base64,SGk=";
    
    data({ url: url }).then(function (content) {
      content.url.should.equal(url);
      content.blob.data.toString().should.equal("Hi");
      content.blob.type.should.equal("text/plain");
    });
  });
});
