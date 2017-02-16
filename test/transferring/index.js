var transferring = require("../../lib/transferring");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
var should = chai.should();

describe("transferring", function () {
  it("should reject when no params", function () {
    transferring.transfer().should.be.rejected;
  });
  
  it("should reject when param is not an object", function () {
    transferring.transfer("http://example.com/").should.be.rejected;
  });
  
  it("should reject when param doesn't have 'url' property", function () {
    transferring.transfer({}).should.be.rejected;
  });
  
  it("should reject when request 'url' is relative", function () {
    transferring.transfer({ url: "/foo" }).should.be.rejected;
  });
  
  it("should reject when there are no registrations", function () {
    transferring.registrations.splice(0, transferring.registrations.length);
    transferring.transfer({ url: "foo://" }).should.be.rejected;
  });
  
  it("should reject when request 'url' protocol scheme is unregistered", function () {
    transferring.transfer({ url: "foo://" }).should.be.rejected;
  });
  
  it("should register handler function in registrations", function () {
    function fooHandler() {
      return Promise.resolve({});
    }
    
    transferring.register("foo", fooHandler);
    
    var found = transferring.registrations.some(registration => {
      return registration.protocol === "foo";
    });
    
    found.should.be.true;
  });
  
  it("should resolve when request 'url' protocol scheme is registered", function () {
    let expected = {};
    
    transferring.register("foo", function () {
      return Promise.resolve(expected);
    });
    
    transferring.transfer({ url: "foo://" }).should.eventually.equal(expected);
  });
});
