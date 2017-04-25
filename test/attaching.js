var attaching = require("../lib/attaching");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var sinon = require("sinon");

chai.use(chaiAsPromised);
var should = chai.should();

describe("attaching", function () {
  it("should reject when no params", function () {
    attaching.attach().should.be.rejected;
  });
  
  it("should reject when param is not an object", function () {
    attaching.attach("this is not a view").should.be.rejected;
  });
  
  it("should reject when param doesn't have 'view' property", function () {
    attaching.attach({}).should.be.rejected;
  });
  
  it("should reject when platform has not been set", function () {
    attaching.attach({ view: {} }).should.be.rejected;
  });
  
  it("should reject when there are no registrations", function () {
    attaching.isAttached = function () { return false; };
    attaching.attach({ view: {} }).should.be.rejected;
  });
  
  it("should reject when the view is not attached", function () {
    attaching.isAttached = function () { return false; };
    attaching.register("mock-attacher", function () {});
    attaching.attach({ view: {} }).should.be.rejected;
  });
  
  it("should resolve when the view is attached", function () {
    let isAttached = sinon.stub().returns(true);
    attaching.setIsAttached(isAttached);
    attaching.register("mock-attacher", function () {});
    
    let result = { view: {} };
    attaching.attach(result).should.eventually.equal(result);
    
    isAttached.called.should.be.true;
  });
});