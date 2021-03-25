"use strict";

var _require = require('webpack'),
    compilation = _require.compilation;

module.exports = /*#__PURE__*/function () {
  function RemoveDefaultResultPlugin() {}

  var _proto = RemoveDefaultResultPlugin.prototype;

  _proto.apply = function apply(compiler) {
    compiler.hooks.compilation.tap('RemoveDefaultResultPlugin', function (compilation) {
      compilation.hooks.shouldGenerateChunkAssets.tap('disableGenerateChunkAssets', function () {
        return false;
      });
    });
  };

  return RemoveDefaultResultPlugin;
}();