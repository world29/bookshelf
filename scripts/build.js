const builder = require("electron-builder");
const fs = require("node:fs/promises");

const ymlContents = `provider: github
owner: world29
repo: bookshelf
channel: latest
updaterCacheDirName: bookshelf-updater\n`;

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
    verifyUpdateCodeSignature: false,
  },
};

async function build() {
  // auto-update.yml を書き出す
  await fs.writeFile(
    "./out/bookshelf-win32-x64/resources/app-update.yml",
    ymlContents,
    "utf8"
  );

  const Platform = builder.Platform;

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
}

build();
