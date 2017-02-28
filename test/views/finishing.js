var finishing = require("../../lib/views/finishing");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
var expect = chai.expect;
var sinon = require("sinon");

describe("finishing", function () {
  it("should throw when no params", function () {
    expect(function () {
      finishing.finish();
    }).to.throw(Error);
  });
  
  it("should throw when param is not an object", function () {
    expect(function () {
      finishing.finish("this is not a build/attach result");
    }).to.throw(Error);
  });
  
  it("should throw when param doesn't have a 'content' property", function () {
    expect(function () {
      finishing.finish({});
    }).to.throw(Error);
  });
  
  it("should throw when param doesn't have a 'view' property", function () {
    expect(function () {
      finishing.finish({ content: {} });
    }).to.throw(Error);
  });
  
  it("should not throw when param has 'content' and 'view' properties", function () {
    expect(function () {
      finishing.finish({ content: {}, view: {} });
    }).to.not.throw(Error);
  });
  
  it("should call finishers with result", function () {
    let result = { content: {}, view: {} };
    
    let finA = sinon.spy();
    finishing.register("finA", finA);
    
    let finB = sinon.spy();
    finishing.register("finB", finB);
    
    finishing.finish(result);
    
    finA.calledWith(result).should.be.true;
    finB.calledWith(result).should.be.true;
  });
});
