import { app, BrowserWindow } from "electron";
import { join } from "path";

import { IFileRegistry } from "../lib/file";
import { IContext } from "./context";
import { FileRegistry } from "./file-registry";
import { setupMenu } from "./menu";

class Context implements IContext {
  private _window: BrowserWindow;
  private _fileRegistry: IFileRegistry;

  constructor(window: BrowserWindow) {
    this._window = window;
    this._fileRegistry = new FileRegistry();
  }

  get fileRegistry(): IFileRegistry {
    return this._fileRegistry;
  }

  get appWindow(): BrowserWindow {
    return this._window;
  }
}

const createWindow = () => {
  const mainWindow: BrowserWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  });
  mainWindow.loadFile("dist/index.html");

  const context = new Context(mainWindow);

  setupMenu(context);

  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
