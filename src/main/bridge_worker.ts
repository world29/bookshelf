import { BrowserWindow, ipcMain } from "electron";

class BridgeWorker {
  private window: BrowserWindow | null;

  constructor() {
    this.window = null;
  }

  emitText(text: string) {
    this.window?.webContents.send("worker:sendMessage", text);
  }

  setupAPIs(mainWindow: BrowserWindow) {
    this.window = mainWindow;

    ipcMain.handle("do-a-thing", () =>
      Promise.resolve("hello from main process.")
    );
  }
}

export default new BridgeWorker();
