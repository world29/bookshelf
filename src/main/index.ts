import { app, BrowserWindow, Menu } from "electron";
import { join } from "path";
import { mkdir } from "node:fs/promises";

import { bridge } from "./api";
import bridge_worker from "./bridge_worker";
import db from "./database";
import { createMenu } from "./menu";
import { loadExtensions } from "./devtools";
import checkForUpdates from "./updater";
import settingsStore from "./settings";

async function createWindow(): Promise<BrowserWindow> {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      preload: join(__dirname, "preload_renderer.js"),
    },
  });
  bridge.setupAPIs(mainWindow);
  mainWindow.loadFile("index.html");

  const menu = createMenu(mainWindow);
  Menu.setApplicationMenu(menu);

  if (process.platform !== "darwin") {
    await loadExtensions();
  }

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  return mainWindow;
}

async function createWorkerWindow(): Promise<BrowserWindow> {
  const workerWindow = new BrowserWindow({
    x: 100,
    y: 100,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  bridge_worker.setupAPIs(workerWindow);
  workerWindow.loadFile("worker.html");

  if (!app.isPackaged) {
    workerWindow.webContents.openDevTools();
  }

  return workerWindow;
}

app.whenReady().then(async () => {
  const data_dir = settingsStore.get("data_dir");
  await mkdir(data_dir, { recursive: true });
  db.initialize(data_dir);

  const win = await createWindow();
  await createWorkerWindow();

  checkForUpdates(win);
});

app.on("activate", async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    console.log("activate");
    await createWindow();
    await createWorkerWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("quit", () => {
  db.finalize();
});
