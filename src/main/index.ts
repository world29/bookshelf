import { app, BrowserWindow, Menu } from "electron";
import { join } from "path";
import { bridge } from "./api";
import db from "./database";
import { createMenu } from "./menu";
import { loadExtensions } from "./devtools";

async function createWindow(): Promise<void> {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  });
  bridge.setupAPIs(mainWindow);
  mainWindow.loadFile("index.html");

  const menu = createMenu(mainWindow);
  Menu.setApplicationMenu(menu);

  await loadExtensions();

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(async () => {
  db.initialize();

  await createWindow();

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
