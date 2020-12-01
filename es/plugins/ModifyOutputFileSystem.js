"use strict";

var MemFs = require('memory-fs');

module.exports = /*#__PURE__*/function () {
  function ModifyOutputFileSystemPlugin() {}

  var _proto = ModifyOutputFileSystemPlugin.prototype;

  _proto.apply = function apply(compiler) {
    compiler.outputFileSystem = new MemFs();
  };

  return ModifyOutputFileSystemPlugin;
}();