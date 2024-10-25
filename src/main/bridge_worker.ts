﻿import { BrowserWindow, ipcMain } from "electron";
import { ThumbnailCreationDesc } from "../models/worker";

class BridgeWorker {
  private window: BrowserWindow | null;

  constructor() {
    this.window = null;
  }

  emitText(text: string) {
    this.window?.webContents.send("worker:sendMessage", text);
  }

  emitThumbnailCreationRequest(desc: ThumbnailCreationDesc) {
    this.window?.webContents.send("worker:createThumbnail", desc);
  }

  createThumbnail(desc: ThumbnailCreationDesc): Promise<string> {
    return new Promise((resolve, reject) => {
      this.window?.webContents.send("worker:createThumbnail", desc);
      //console.log(`worker:createThumbnail: ${desc.path}`);
      ipcMain.once("worker:createThumbnailReply", (_event, outPath, err) => {
        if (err) {
          reject(err);
        }

        //console.log(`worker:createThumbnailReply: ${outPath}`);
        resolve(outPath);
      });
    });
  }

  setupAPIs(mainWindow: BrowserWindow) {
    this.window = mainWindow;
  }
}

export default new BridgeWorker();
