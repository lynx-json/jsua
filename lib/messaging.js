"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hub = undefined;

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hub = new _events2.default();
exports.hub = hub;