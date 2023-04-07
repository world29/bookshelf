﻿import { BrowserWindow, dialog, ipcMain, IpcMainInvokeEvent } from "electron";

import db from "./database";
import settingsStore from "./settings";
import { openFile } from "./shell";
import { createThumbnailFromFile } from "./thumbnail";

const setupAPIs = (mainWindow: BrowserWindow) => {
  ipcMain.handle("do-a-thing", () =>
    Promise.resolve("hello from main process.")
  );

  ipcMain.handle(
    "find-books",
    (_event: IpcMainInvokeEvent, searchQuery: string) =>
      db.findBooks(searchQuery)
  );

  ipcMain.handle(
    "update-book",
    (_event: IpcMainInvokeEvent, path: string, title: string, author: string) =>
      db.updateBook(path, title, author)
  );

  ipcMain.handle(
    "update-book-thumbnail",
    (_event: IpcMainInvokeEvent, path: string, thumbnailPath: string) =>
      db.updateBookThumbnail(path, thumbnailPath)
  );

  ipcMain.handle("add-book", (_event: IpcMainInvokeEvent, path: string) =>
    db.addBook(path)
  );

  ipcMain.handle("remove-book", (_event: IpcMainInvokeEvent, path: string) =>
    db.removeBook(path)
  );

  ipcMain.handle(
    "create-thumbnail",
    (_event: IpcMainInvokeEvent, filePath: string) =>
      createThumbnailFromFile(filePath)
  );

  ipcMain.handle("open-file", (_event: IpcMainInvokeEvent, filePath: string) =>
    openFile(filePath)
  );

  ipcMain.handle("get-settings", () => {
    console.log("get-settings invoked");
    console.dir(settingsStore.store);
    return Promise.resolve(settingsStore.store);
  });

  ipcMain.handle(
    "set-settings-viewer",
    (_event: IpcMainInvokeEvent, viewerPath: string) =>
      new Promise<void>((resolve) => {
        settingsStore.set("viewer", viewerPath);
        resolve();
      })
  );

  ipcMain.handle("open-file-dialog", () =>
    dialog.showOpenDialog(mainWindow, {
      properties: ["openFile"],
      title: "ファイルを選択",
      filters: [
        /*
        {
          name: "画像ファイル",
          extensions: ["png", "jpg", "jpeg"],
        },
        */
        {
          name: "アーカイブファイル",
          extensions: ["zip"],
        },
      ],
    })
  );
};

export default setupAPIs;
