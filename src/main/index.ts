﻿import { app, BrowserWindow } from "electron";

const createWindow = () => {
  const mainWindow: BrowserWindow = new BrowserWindow({
    width: 1600,
    height: 900,
  });
  mainWindow.loadFile("dist/index.html");

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
