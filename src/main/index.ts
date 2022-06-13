import { app, BrowserWindow } from "electron";
import { join } from "path";

import { IBookRepository } from "../lib/book";
import { IContext } from "./context";
import bookRepository from "./book-repository";
import { setupMenu } from "./menu";

class Context implements IContext {
  private _window: BrowserWindow;
  private _bookRepository: IBookRepository;

  constructor(window: BrowserWindow) {
    this._window = window;
    this._bookRepository = bookRepository;
  }

  get bookRepository(): IBookRepository {
    return this._bookRepository;
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
  mainWindow.loadFile("index.html");

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

app.on("quit", () => {
  bookRepository.finalize();
});
