var media = require("../dist/media");
var chai = require("chai");
var expect = chai.expect;
var sinon = require("sinon");
require("./html-document-api");

describe("media / register", function () {
  it("should throw when no params", function () {
    expect(function () {
      media.register();
    }).to.throw(Error);
  });
  
  it("should throw when 'media' is not a string", function () {
    expect(function () {
      media.register({ media: "http://www.example.com/media-one" }, function () {});
    }).to.throw(Error);
  });
  
  it("should throw when 'supports' is not a function", function () {
    expect(function () {
      media.register("http://www.example.com/media-one", {});
    }).to.throw(Error);
  });
  
  it("should register media without 'supports' param", function () {
    var mediaId = "http://www.example.com/media-one";
    
    media.register(mediaId);
    
    var isRegistered = media.registrations.some(registration => registration.media === mediaId);
    expect(isRegistered).to.equal(true);
  });
  
  it("should register media with 'supports' param", function () {
    var mediaId = "http://www.example.com/media-one";
    
    media.register(mediaId, function () {});
    
    var isRegistered = media.registrations.some(registration => registration.media === mediaId);
    expect(isRegistered).to.equal(true);
  });
});

describe.only("media / supports", function () {
  it("should throw when no params", function () {
    expect(function () {
      media.supports();
    }).to.throw(Error);
  });
  
  it("should throw when 'source' is not an object", function () {
    expect(function () {
      media.supports('source');
    }).to.throw(Error);
  });
  
  it("should always support 'screen' media", function () {
    expect(media.supports({ media: 'screen' })).to.equal(true);
  });
  
  if ('devicePixelRatio' in window === false) {
    window.devicePixelRatio = 3;
  }
  
  if (window.devicePixelRatio > 1) {
    it("should support 'screen' media with high scale equal to dppx", function () {
      var source = { media: 'screen' };
      source.scale = window.devicePixelRatio;
      expect(media.supports(source)).to.equal(true);
    });
    
    it("should support 'screen' media with high scale less than dppx", function () {
      var source = { media: 'screen' };
      source.scale = 2;
      if (source.scale === window.devicePixelRatio) source.scale = 1.9;
      expect(media.supports(source)).to.equal(true);
    });
  } else {
    it("[unable to test in dppx=1 browser] should support 'screen' media with high scale equal to dppx");
    it("[unable to test in dppx=1 browser] should support 'screen' media with high scale less than to dppx");
  }
  
  it("should always support undefined media (because 'screen' is default)", function () {
    expect(media.supports({})).to.equal(true);
  });
  
  it("should call media registration's 'supports' function", function () {
    var mediaOneId = 'http://www.example.com/media-one';
    var mediaTwoId = 'http://www.example.com/media-two';
    var supportsOne = sinon.stub();
    var supportsTwo = sinon.stub();
    supportsOne.returns(true);
    supportsTwo.returns(false);
    media.register(mediaOneId, supportsOne);
    media.register(mediaTwoId, supportsTwo);
    var sourceOne = { media: mediaOneId };
    var sourceTwo = { media: mediaTwoId };
    
    var isOneSupported = media.supports(sourceOne);
    var isTwoSupported = media.supports(sourceTwo);
    
    expect(supportsOne.calledOnce).to.equal(true);
    expect(isOneSupported).to.equal(true);
    expect(supportsTwo.calledOnce).to.equal(true);
    expect(isTwoSupported).to.equal(false);
  });
});
