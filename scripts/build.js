const builder = require("electron-builder");
const Platform = builder.Platform;

// Let's get that intellisense working
/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const options = {
  directories: {
    output: "release",
  },
  win: {
    target: "nsis",
  },
};

builder
  .build({
    targets: Platform.WINDOWS.createTarget(),
    config: options,
    prepackaged: "./out/bookshelf-win32-x64",
  })
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((error) => {
    console.error(error);
  });
