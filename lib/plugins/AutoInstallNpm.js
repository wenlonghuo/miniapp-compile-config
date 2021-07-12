"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('miniapp-builder-shared'),
    autoInstallNpm = _require.autoInstallNpm;

var _require2 = require('fs-extra'),
    writeJSONSync = _require2.writeJSONSync;

var _require3 = require('path'),
    join = _require3.join;
/**
 * Auto install npm
 */


module.exports = /*#__PURE__*/function () {
  function AutoInstallNpmPlugin(_ref) {
    var _ref$nativePackage = _ref.nativePackage,
        nativePackage = _ref$nativePackage === void 0 ? {} : _ref$nativePackage;
    this.autoInstall = nativePackage.autoInstall;
    this.dependencies = nativePackage.dependencies || null;
  }

  var _proto = AutoInstallNpmPlugin.prototype;

  _proto.apply = function apply(compiler) {
    var _this = this;

    compiler.hooks.done.tapAsync('AutoInstallNpmPlugin', /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(stats, callback) {
        var distDir, pkgFilePath;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                distDir = stats.compilation.outputOptions.path; // Generate package.json

                if (_this.dependencies) {
                  pkgFilePath = join(distDir, 'package.json');
                  writeJSONSync(pkgFilePath, {
                    dependencies: _this.dependencies
                  });
                }

                if (_this.autoInstall) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt("return", callback());

              case 4:
                _context.next = 6;
                return autoInstallNpm(distDir, callback);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }());
  };

  return AutoInstallNpmPlugin;
}();