"use strict";

var _require = require('path'),
    dirname = _require.dirname,
    join = _require.join;

var _require2 = require('miniapp-builder-shared'),
    _require2$pathHelper = _require2.pathHelper,
    absoluteModuleResolve = _require2$pathHelper.absoluteModuleResolve,
    getDepPath = _require2$pathHelper.getDepPath,
    getAppConfig = _require2.getAppConfig,
    filterNativePages = _require2.filterNativePages;

function clearEntry(config) {
  config.entryPoints.clear();
}

function getEntry(entryAppFilePath, routes, rootDir, subAppRoot) {
  if (subAppRoot === void 0) {
    subAppRoot = '';
  }

  var sourcePath = join(rootDir, 'src');
  var entry = {};

  if (entryAppFilePath) {
    entry.app = absoluteModuleResolve(rootDir, "./" + entryAppFilePath) + '?role=app'; // Mark it as app file
  }

  if (Array.isArray(routes)) {
    routes.forEach(function (_ref) {
      var pageSource = _ref.source;
      entry[subAppRoot + "@page@" + pageSource] = getDepPath(rootDir, pageSource, sourcePath) + "?role=page"; // Mark it as page file
    });
  }

  return entry;
}

function configEntry(config, routes, options) {
  var entryPath = options.entryPath,
      rootDir = options.rootDir,
      _options$subAppRoot = options.subAppRoot,
      subAppRoot = _options$subAppRoot === void 0 ? '' : _options$subAppRoot;
  var entries = getEntry(entryPath, routes, rootDir, subAppRoot);

  for (var _i = 0, _Object$entries = Object.entries(entries); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _Object$entries[_i],
        entryName = _Object$entries$_i[0],
        source = _Object$entries$_i[1];
    var entryConfig = config.entry(entryName);
    entryConfig.add(source);
  }
}

function setEntry(config, routes, options) {
  var needCopyList = options.needCopyList,
      rootDir = options.rootDir,
      target = options.target,
      outputPath = options.outputPath;
  clearEntry(config);
  var filteredRoutes = filterNativePages(routes, needCopyList, {
    rootDir: rootDir,
    target: target,
    outputPath: outputPath
  });
  configEntry(config, filteredRoutes, options);
}

function setMultiplePackageEntry(config, routes, options) {
  var rootDir = options.rootDir,
      target = options.target,
      outputPath = options.outputPath,
      subAppConfigList = options.subAppConfigList,
      needCopyList = options.needCopyList;
  clearEntry(config);
  routes.forEach(function (app) {
    var subAppRoot = dirname(app.source);
    var subAppConfig = getAppConfig(rootDir, target, null, subAppRoot);
    var filteredRoutes = filterNativePages(subAppConfig.routes, needCopyList, {
      rootDir: rootDir,
      target: target,
      outputPath: outputPath,
      subAppRoot: subAppRoot
    });
    configEntry(config, filteredRoutes, {
      entryPath: app.miniappMain ? join('src', app.source) : null,
      rootDir: rootDir,
      subAppRoot: subAppRoot
    });
    subAppConfig.miniappMain = app.miniappMain;
    subAppConfigList.push(subAppConfig);
  });
}

module.exports = {
  setEntry: setEntry,
  setMultiplePackageEntry: setMultiplePackageEntry
};