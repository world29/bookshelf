import { app, BrowserWindow } from "electron";
import { join } from "path";

import setupAPIs from "./api";
import db from "./database";

const createWindow = () => {
  const mainWindow: BrowserWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  });
  mainWindow.loadFile("index.html");

  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  db.initialize();
  setupAPIs();

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("quit", () => {
  db.finalize();
});
