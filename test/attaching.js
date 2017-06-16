var attaching = require("../dist/attaching");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
var sinon = require("sinon");


chai.use(chaiAsPromised);
var should = chai.should();

function createView() {
  var view = { 
    matches: sinon.stub(),
    querySelectorAll: sinon.stub()
  };
  
  view.matches.returns(false);
  view.querySelectorAll.returns([]);
  
  return view;
}

describe("attaching", function () {
  it("should reject when no params", function () {
    return attaching.attach().should.be.rejected;
  });
  
  it("should reject when param is not an object", function () {
    return attaching.attach("this is not a view").should.be.rejected;
  });
  
  it("should reject when param doesn't have 'view' property", function () {
    return attaching.attach({}).should.be.rejected;
  });
  
  it("should reject when there are no registrations", function () {
    return attaching.attach({ view: {} }).should.be.rejected;
  });
  
  it("should reject when the view is not attached", function () {
    attaching.register("mock-attacher", function () {});
    return attaching.attach({ view: {} }).should.be.rejected;
  });
  
  it("should reject when the view is discarded", function () {
    attaching.register("mock-attacher", function () {
      return {
        discard: true
      };
    });
    
    return attaching.attach({ view: {} }).should.be.rejected;
  });
  
  it("should have Error.name of 'ViewDiscardedError' when the view is discarded", function () {
    attaching.register("mock-attacher", function () {
      return {
        discard: true
      };
    });
    
    return attaching.attach({ view: {} }).catch(function (err) {
      expect(err.name).to.equal("ViewDiscardedError");
    });
  });
  
  it("should resolve when the view is attached", function () {
    sinon.stub(attaching, "raiseAttachDetachEvent");
    
    attaching.register("mock-attacher", function () {
      return {
        attach: function () {}
      };
    });
    
    let result = { view: createView() };
    
    return attaching.attach(result).then(function (r) {
      expect(r).to.equal(result);
      attaching.raiseAttachDetachEvent.restore();
    });
  });
});
