var finishing = require("../dist/finishing");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
var expect = chai.expect;
var sinon = require("sinon");
require("./html-document-api");

function createView() {
  var view = {
    matches: sinon.stub(),
    querySelectorAll: sinon.stub()
  };

  view.matches.returns(false);
  view.querySelectorAll.returns([]);

  return view;
}

describe("finishing", function () {
  beforeEach(function () {
    // clear all registrations before each test
    finishing.registrations.splice(0, finishing.registrations.length);
  });

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
      finishing.finish({ content: {}, view: createView() });
    }).to.not.throw(Error);
  });

  it("should call finisher functions with result", function () {
    let result = { content: {}, view: createView() };

    let finA = sinon.spy();
    finishing.register("finA", finA);

    let finB = sinon.spy();
    finishing.register("finB", finB);

    finishing.finish(result);

    finA.calledWith(result).should.be.true;
    finB.calledWith(result).should.be.true;
  });

  it("should call finisher functions despite error", function () {
    let result = { content: {}, view: createView() };

    let finA = function () { throw new Error("Error in finA."); };
    finishing.register("finA", finA);

    let finB = sinon.spy();
    finishing.register("finB", finB);

    finishing.finish(result);
    finB.calledWith(result).should.be.true;
  });

  it("should not call finisher when condition is unmet", function () {
    let result = { content: {}, view: createView() };

    let condition = sinon.stub();
    condition.returns(false);
    let finisher = sinon.spy();

    finishing.register("finisher", finisher, condition);
    finishing.finish(result);

    condition.calledWith(result).should.be.true;
    finisher.calledOnce.should.be.false;
  });

  it("should call finisher when condition is met", function () {
    let result = { content: {}, view: createView() };

    let condition = sinon.stub();
    condition.returns(true);
    let finisher = sinon.spy();

    finishing.register("finisher", finisher, condition);
    finishing.finish(result);

    condition.calledWith(result).should.be.true;
    finisher.calledWith(result).should.be.true;
  });

  it("should call finisher arrays with result", function () {
    let result = { content: {}, view: createView() };
    let finisher = [];

    let finA = sinon.spy();
    finisher.push(finA);

    let finB = sinon.spy();
    finisher.push(finB);

    finishing.register("finisher-array", finisher);
    finishing.finish(result);

    finA.calledWith(result).should.be.true;
    finB.calledWith(result).should.be.true;
  });

  it("should not call finisher arrays when condition is unmet", function () {
    let result = { content: {}, view: createView() };
    let finisher = [];

    let finA = sinon.spy();
    finisher.push(finA);

    let finB = sinon.spy();
    finisher.push(finB);

    let condition = sinon.stub();
    condition.returns(false);

    finishing.register("finisher-array", finisher, condition);
    finishing.finish(result);

    condition.calledWith(result).should.be.true;
    finA.calledOnce.should.be.false;
    finB.calledOnce.should.be.false;
  });

  it("should call finisher arrays when condition is met", function () {
    let result = { content: {}, view: createView() };
    let finisher = [];

    let finA = sinon.spy();
    finisher.push(finA);

    let finB = sinon.spy();
    finisher.push(finB);

    let condition = sinon.stub();
    condition.returns(true);

    finishing.register("finisher-array", finisher, condition);
    finishing.finish(result);

    condition.calledWith(result).should.be.true;
    finA.calledWith(result).should.be.true;
    finB.calledWith(result).should.be.true;
  });

  describe("scrolling and focus", function () {
    var result, focusableOne, focusableTwo;

    beforeEach(function () {
      result = {
        view: document.createElement("div"),
        content: {}
      };

      sinon.spy(finishing, "setFocus");
      sinon.stub(finishing, "scrollIntoView");
      sinon.stub(finishing, "isDisplayed");

      focusableOne = document.createElement("div");
      focusableOne.setAttribute("data-jsua-focus", true);
      result.view.appendChild(focusableOne);
      sinon.spy(focusableOne, "focus");

      focusableTwo = document.createElement("div");
      focusableTwo.setAttribute("data-jsua-focus", true);
      result.view.appendChild(focusableTwo);
      sinon.spy(focusableTwo, "focus");
    });

    it("should focus on the first focus element", function () {
      function verifySpies() {
        focusableOne.focus.called.should.be.true;
        finishing.setFocus.calledWith(focusableOne).should.be.true;
        finishing.isDisplayed.calledWith(focusableOne).should.be.true;
        finishing.scrollIntoView.calledWith(focusableOne).should.be.true;

        focusableTwo.focus.called.should.be.false;
        finishing.setFocus.calledWith(focusableTwo).should.be.false;
        finishing.isDisplayed.calledWith(focusableTwo).should.be.false;
        finishing.scrollIntoView.calledWith(focusableTwo).should.be.false;
      }

      return Promise.resolve(result)
        .then(finishing.finish)
        .then(verifySpies, verifySpies);
    });
  });
});
