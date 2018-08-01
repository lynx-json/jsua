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
  it("should throw when no params", function () {
    expect(function () {
      attaching.attach();
    }).to.throw();
  });

  it("should throw when param is not an object", function () {
    expect(function () {
      attaching.attach("this is not a view");
    }).to.throw();
  });

  it("should throw when param doesn't have 'view' property", function () {
    expect(function () {
      attaching.attach({});
    }).to.throw();
  });

  it("should throw when there are no registrations", function () {
    expect(function () {
      attaching.attach({ view: {} });
    }).to.throw();
  });

  it("should throw when the view is not attached", function () {
    attaching.register("mock-attacher", function () {});
    expect(function () {
      attaching.attach({ view: {} });
    }).to.throw();
  });

  it("should throw when the view is discarded", function () {
    attaching.register("mock-attacher", function () {
      return {
        discard: true
      };
    });

    expect(function () {
      attaching.attach({ view: {} });
    }).to.throw();
  });

  it("should have Error.name of 'ViewDiscardedError' when the view is discarded", function () {
    attaching.register("mock-attacher", function () {
      return {
        discard: true
      };
    });

    expect(function () {
      attaching.attach({ view: {} });
    }).to.throw({ name: "ViewDiscardedError" });
  });

  it("should return when the view is attached", function () {
    sinon.stub(attaching, "raiseAttachDetachEvent");

    attaching.register("mock-attacher", function () {
      return {
        attach: function () {}
      };
    });

    let result = { view: createView() };
    let r = attaching.attach(result);
    expect(r).to.equal(result);
    attaching.raiseAttachDetachEvent.restore();
  });
});
