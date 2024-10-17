const { getAppUpdateYml } = require("electron-updater-yaml");
const builder = require("electron-builder");

const Platform = builder.Platform;

/**
 * @type {import('electron-updater-yaml').AppUpdateYmlOptions}
 */
const ymlOptions = {
  name: "bookshelf",
  url: "https://github.com/world29/bookshelf.git",
};

const appUpdateYml = await getAppUpdateYml(ymlOptions);
await fs.writeFile(
  "./out/bookshelf-win32-x64/resources/app-update.yml",
  appUpdateYml,
  "utf8"
);

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const options = {
  directories: {
    output: "release",
  },
  publish: {
    provider: "github",
    owner: "world29",
    repo: "bookshelf",
    private: true,
  },
  win: {
    target: "nsis",
    icon: "build/icon.ico",
  },
};

builder
  .build({
    targets: Platform.WINDOWS.createTarget(),
    config: options,
    prepackaged: "./out/bookshelf-win32-x64",
    publish: "always",
  })
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((error) => {
    console.error(error);
  });
