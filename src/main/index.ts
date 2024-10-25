import { app, BrowserWindow, Menu } from "electron";
import { join } from "path";
import { bridge } from "./api";
import bridge_worker from "./bridge_worker";
import db from "./database";
import { createMenu } from "./menu";
import { loadExtensions } from "./devtools";
import checkForUpdates from "./updater";
import { ThumbnailCreationDesc } from "../models/worker";

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

  await loadExtensions();

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  return mainWindow;
}

async function createWorkerWindow(): Promise<BrowserWindow> {
  const workerWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    show: true,
    webPreferences: {
      //preload: join(__dirname, "preload_worker.js"),
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
  db.initialize();

  const win = await createWindow();
  await createWorkerWindow();

  checkForUpdates(win);

  const thumbnailsDir = join(app.getPath("userData"), "thumbnails");

  const desc: ThumbnailCreationDesc = {
    path: "/path/to/image.png",
    out_dir: join(thumbnailsDir, "dummy"),
    width: 256,
    height: 256,
  };
  const thumbnailPath = await bridge_worker.createThumbnail(desc);
  console.log(thumbnailPath);

  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
      await createWorkerWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("quit", () => {
  db.finalize();
});
