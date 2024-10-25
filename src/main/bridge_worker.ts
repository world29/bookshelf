import { BrowserWindow, ipcMain } from "electron";
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
    return new Promise((resolve) => {
      this.window?.webContents.send("worker:createThumbnail", desc);
      console.log("worker:createThumbnail");
      ipcMain.once("worker:createThumbnailReply", (_event, outPath) => {
        console.log("worker:createThumbnailReply");
        resolve(outPath);
      });
    });
  }

  setupAPIs(mainWindow: BrowserWindow) {
    this.window = mainWindow;
  }
}

export default new BridgeWorker();
