import log from "electron-log";
import { BrowserWindow } from "electron";

import { getAutoUpdater } from "./updater-wrapper";

export default function checkForUpdates(win: BrowserWindow): void {
  function sendStatusToWindow(text: string) {
    log.info(text);
    win.webContents.send("message", text);
  }

  const autoUpdater = getAutoUpdater();

  autoUpdater.on("checking-for-update", () => {
    sendStatusToWindow("Checking for update...");
  });
  autoUpdater.on("update-available", (info) => {
    sendStatusToWindow("Update available.");
  });
  autoUpdater.on("update-not-available", (info) => {
    sendStatusToWindow("Update not available.");
  });
  autoUpdater.on("error", (err) => {
    sendStatusToWindow("Error in auto-updater. " + err);
  });
  autoUpdater.on("download-progress", (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + " - Downloaded " + progressObj.percent + "%";
    log_message =
      log_message +
      " (" +
      progressObj.transferred +
      "/" +
      progressObj.total +
      ")";
    sendStatusToWindow(log_message);
  });
  autoUpdater.on("update-downloaded", (info) => {
    sendStatusToWindow("Update downloaded");
  });

  log.transports.file.level = "debug";
  autoUpdater.logger = log;
  autoUpdater.checkForUpdatesAndNotify();
}
