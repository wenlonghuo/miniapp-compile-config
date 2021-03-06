const { dirname, resolve } = require('path');
const {
  platformMap,
  getAppConfig,
} = require('miniapp-builder-shared');
const { existsSync } = require('fs-extra');

const MiniAppConfigPlugin = require('rax-miniapp-config-webpack-plugin');

const AppLoader = require.resolve('jsx2mp-loader/src/app-loader');
const PageLoader = require.resolve('jsx2mp-loader/src/page-loader');

const setBaseConfig = require('./setBaseConfig');
const { setEntry, setMultiplePackageEntry } = require('./setEntry');

module.exports = (
  config,
  userConfig = {},
  { context, target, entryPath, outputPath }
) => {
  const platformInfo = platformMap[target];
  const {
    disableCopyNpm = false,
    turnOffSourceMap = false,
    constantDir = [],
    subPackages = false,
    externals = {}
  } = userConfig;
  const { rootDir, command } = context;
  const mode = command;

  const appConfig = getAppConfig(rootDir, target);

  // Need Copy files or dir
  const needCopyList = [];
  // Record all the sub app configs
  const subAppConfigList = [];

  if (subPackages) {
    setMultiplePackageEntry(config, appConfig.routes, { rootDir, target, outputPath, subAppConfigList, needCopyList });
  } else {
    setEntry(config, appConfig.routes, { entryPath, rootDir, target, outputPath, needCopyList });
  }

  // Set constantDir
  // `public` directory is the default static resource directory
  const isPublicFileExist = existsSync(resolve(rootDir, 'src/public'));

  const loaderParams = {
    mode,
    entryPath,
    outputPath,
    disableCopyNpm,
    turnOffSourceMap,
    platform: platformInfo,
    // To make old `constantDir` param compatible
    constantDir: isPublicFileExist
      ? ['src/public'].concat(constantDir)
      : constantDir,
    rootDir,
    externals
  };

  const pageLoaderParams = {
    ...loaderParams,
    entryPath,
  };

  const appLoaderParams = {
    ...loaderParams,
    entryPath: dirname(entryPath),
  };

  needCopyList.forEach((dirPatterns) =>
    loaderParams.constantDir.push(dirPatterns.from)
  );

  config.cache(true).mode('production').target('node');

  // Set base jsx2mp config
  setBaseConfig(config, userConfig, {
    entryPath,
    context,
    loaderParams,
    target,
    outputPath,
  });

  // Add app and page jsx2mp loader
  config.module
    .rule('withRoleJSX')
    .use('app')
    .loader(AppLoader)
    .options(appLoaderParams)
    .end()
    .use('page')
    .loader(PageLoader)
    .options(pageLoaderParams)
    .end();

  config.plugin('miniAppConfig').use(MiniAppConfigPlugin, [
    {
      type: 'complie',
      subPackages,
      appConfig,
      subAppConfigList,
      outputPath,
      target,
      nativeConfig: userConfig.nativeConfig,
    },
  ]);

  const aliasEntries = config.resolve.alias.entries();
  config.module
    .rule('withRoleJSX')
    .use('app')
    .tap((appLoaderParams) => {
      return {
        ...appLoaderParams,
        aliasEntries,
      };
    })
    .end()
    .use('page')
    .tap((pageLoaderParams) => {
      return {
        ...pageLoaderParams,
        aliasEntries,
      };
    });
};
