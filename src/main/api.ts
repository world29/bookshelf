import { ipcMain, IpcMainInvokeEvent } from "electron";

import db from "./database";

const setupAPIs = () => {
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
    "add-book",
    (_event: IpcMainInvokeEvent, path: string, title: string, author: string) =>
      db.addBook(path, title, author)
  );
};

export default setupAPIs;
