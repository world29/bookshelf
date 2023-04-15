import {
  BrowserWindow,
  dialog,
  ipcMain,
  IpcMainInvokeEvent,
  shell,
} from "electron";

import { OpenFileType } from "../models/dialog";
import db from "./database";
import settingsStore from "./settings";
import { openFile } from "./shell";
import { BookFileInfo, getBookFileInfo } from "./book";
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

  ipcMain.handle(
    "update-book-rating",
    (_event: IpcMainInvokeEvent, path: string, rating: number) =>
      db.updateBookRating(path, rating)
  );

  ipcMain.handle("add-book", (_event: IpcMainInvokeEvent, path: string) =>
    getBookFileInfo(path).then(({ path, title, modifiedTime }) =>
      db.addBook(path, title, modifiedTime)
    )
  );

  ipcMain.handle(
    "add-books",
    async (_event: IpcMainInvokeEvent, paths: string[]) => {
      const promises = paths.map((path) => getBookFileInfo(path));

      const results: PromiseSettledResult<BookFileInfo>[] =
        await Promise.allSettled(promises);

      // ファイル情報の取得に成功したものだけデータベースに登録する
      const fullfilledResults = results.filter(
        (result) => result.status === "fulfilled"
      ) as PromiseFulfilledResult<BookFileInfo>[];

      const bookInfos = fullfilledResults.map((result) => result.value);

      return db.addBooks(bookInfos);
    }
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

  ipcMain.handle(
    "open-file-dialog",
    (_event: IpcMainInvokeEvent, fileType: OpenFileType) =>
      dialog.showOpenDialog(mainWindow, {
        properties: [fileType, "multiSelections"],
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

  ipcMain.handle(
    "show-item-in-folder",
    (_event: IpcMainInvokeEvent, path: string) => shell.showItemInFolder(path)
  );

  ipcMain.handle("move-to-trash", (_event: IpcMainInvokeEvent, path: string) =>
    shell.trashItem(path)
  );
};

export default setupAPIs;
