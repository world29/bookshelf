const electronInstaller = require("electron-winstaller");

console.log("creating installer...");

electronInstaller
  .createWindowsInstaller({
    appDirectory: "./out/bookshelf-win32-x64",
    outputDirectory: "./out/dist/win32-x64",
    authors: "world29",
    exe: "bookshelf.exe",
  })
  .then(() => {
    console.log("completed.");
  })
  .catch((e) => {
    console.error(e.message);
  });
