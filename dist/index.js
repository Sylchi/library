"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _react = require("./react");
Object.keys(_react).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _react[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _react[key];
    }
  });
});