var building = require("../dist/building");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;

chai.use(chaiAsPromised);
var should = chai.should();

describe("building", function () {
  it("should reject when no params", function () {
    building.build().should.be.rejected;
  });
  
  it("should reject when param is not an object", function () {
    building.build("this is not a view").should.be.rejected;
  });
  
  it("should reject when param doesn't have 'blob' property", function () {
    building.build({}).should.be.rejected;
  });
  
  it("should reject when param doesn't have 'blob.type' property", function () {
    building.build({ blob: {} }).should.be.rejected;
  });
  
  it("should reject when there are no registrations", function () {
    building.build({ blob: { type: "text/markdown" } }).should.be.rejected;
  });
  
  it("should reject when no registered builder matches the content type", function () {
    building.register("text/plain", function () {});
    building.build({ blob: { type: "text/markdown" } }).should.be.rejected;
  });
  
  it("should resolve when a builder matches the content type", function () {
    let content = {
      blob: {
        type: "text/plain"
      }
    };
    
    let view = {};
    
    let result = {
      content: content,
      view: view
    };
    
    building.register("text/plain", function (content) { 
      return Promise.resolve(view);
    });
    
    building.build(content).should.eventually.deep.equal(result);
  });
  
  it("should sort registrations by media type range specificity", function () {
    building.register("*/*", function () {});
    building.register("text/plain", function () {});
    building.register("text/*", function () {});
    building.register("text/html", function () {});
    
    function differenceOfIndicies(x, y) {
      x = building.registrations.find(r => r.mediaType === x);
      y = building.registrations.find(r => r.mediaType === y);
      
      x = building.registrations.indexOf(x);
      y = building.registrations.indexOf(y);
      
      return x - y;
    }
    
    expect(differenceOfIndicies("text/plain", "text/*") < 0).to.be.true;
    expect(differenceOfIndicies("text/html", "text/*") < 0).to.be.true;
    expect(differenceOfIndicies("text/plain", "*/*") < 0).to.be.true;
    expect(differenceOfIndicies("text/html", "*/*") < 0).to.be.true;
    expect(differenceOfIndicies("text/*", "*/*") < 0).to.be.true;
    expect(differenceOfIndicies("text/*", "*/*") < 0).to.be.true;
  });
});
