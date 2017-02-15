var http_data = require("../../lib/transferring/http-data");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
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

describe("transferring / http-data", function () {
  it("should resolve when request param is valid", function () {
    let expected = { url: "http://example.com/", blob: mockBlob };
    http_data.transfer({ url: "http://example.com/" }).should.eventually.deep.equal(expected);
  });
});
