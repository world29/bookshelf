import {
  autoUpdater,
  ProgressInfo,
  UpdateInfo,
  UpdaterEvents,
} from "electron-updater";
import log from "electron-log";
import { BrowserWindow, ipcMain } from "electron";
import {
  updaterChannel,
  UpdaterError,
  UpdaterProgressInfo,
  UpdaterUpdateInfo,
} from "../models/autoUpdater";

export default function initializeAutoUpdater(win: BrowserWindow): void {
  function sendStatusToWindow(
    event: UpdaterEvents,
    info?: UpdaterUpdateInfo | UpdaterProgressInfo | UpdaterError
  ) {
    log.info(event);
    win.webContents.send(updaterChannel, event, info);
  }
  autoUpdater.on("checking-for-update", () => {
    sendStatusToWindow("checking-for-update");
  });
  autoUpdater.on("update-available", (info: UpdateInfo) => {
    sendStatusToWindow("update-available", info);
  });
  autoUpdater.on("update-not-available", (info: UpdateInfo) => {
    sendStatusToWindow("update-not-available", info);
  });
  autoUpdater.on("error", (err: Error) => {
    sendStatusToWindow("error", err);
  });
  autoUpdater.on("download-progress", (progressObj: ProgressInfo) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + " - Downloaded " + progressObj.percent + "%";
    log_message =
      log_message +
      " (" +
      progressObj.transferred +
      "/" +
      progressObj.total +
      ")";
    log.info(log_message);
    sendStatusToWindow("download-progress", progressObj);
  });
  autoUpdater.on("update-downloaded", (info: UpdateInfo) => {
    sendStatusToWindow("update-downloaded", info);
  });

  ipcMain.on("quitAndInstall", () => {
    autoUpdater.quitAndInstall();
  });

  ipcMain.handle("checkForUpdatesAndNotify", () =>
    autoUpdater.checkForUpdatesAndNotify()
  );

  log.transports.file.level = "debug";
  autoUpdater.logger = log;
}
