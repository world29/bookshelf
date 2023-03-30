import { ipcMain, IpcMainInvokeEvent } from "electron";

import db from "./database";

const setupAPIs = () => {
  ipcMain.handle("do-a-thing", (_event: IpcMainInvokeEvent) =>
    Promise.resolve("hello from main process.")
  );

  ipcMain.handle(
    "find-books",
    (_event: IpcMainInvokeEvent, searchQuery: string) =>
      db.findBooks(searchQuery)
  );
};

export default setupAPIs;
