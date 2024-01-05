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
import { Book } from "../models/book";
import { FilterByRating, FilterByTag } from "../models/filter";
import { SortOrder } from "../models/sortOrder";

// レンダラープロセスとの IPC 通信のセットアップ
// レンダラープロセスへイベントを送信するための API を公開
class Bridge {
  private window: BrowserWindow | null;

  constructor() {
    this.window = null;
  }

  emitBooksAdded(books: Book[]) {
    this.window?.webContents.send("progress:booksAdded", books);
  }

  emitBookUpdated(book: Book) {
    this.window?.webContents.send("progress:bookUpdated", book);
  }

  setupAPIs(mainWindow: BrowserWindow) {
    this.window = mainWindow;

    ipcMain.handle("do-a-thing", () =>
      Promise.resolve("hello from main process.")
    );

    ipcMain.handle(
      "find-books",
      (_event: IpcMainInvokeEvent, searchQuery: string) =>
        db.findBooks(searchQuery)
    );

    ipcMain.handle("get-book-count", () => db.getBookCount());

    ipcMain.handle(
      "filter-and-fetch-books",
      (
        _event: IpcMainInvokeEvent,
        keyword: string,
        tag: FilterByTag,
        rating: FilterByRating,
        order: SortOrder,
        count: number,
        offset: number
      ) => db.filterAndFetchBooks(keyword, tag, rating, order, count, offset)
    );

    ipcMain.handle(
      "update-book",
      (
        _event: IpcMainInvokeEvent,
        path: string,
        title: string,
        author: string
      ) => db.updateBook(path, title, author)
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
      async (_event: IpcMainInvokeEvent, paths: string[]): Promise<void> => {
        const promises = paths.map((path) => getBookFileInfo(path));

        const results = await Promise.allSettled(promises);

        // ファイル情報の取得に成功したものだけデータベースに登録する
        const fullfilledResults = results.filter(
          (result) => result.status === "fulfilled"
        ) as PromiseFulfilledResult<BookFileInfo>[];

        const bookInfos = fullfilledResults.map((result) => result.value);

        const books = await db.addBooks(bookInfos);
        // ファイル一括登録イベント
        this.emitBooksAdded(books);

        // サムネイルを一つずつ作成する
        for (const book of books) {
          try {
            const thumbnailPath = await createThumbnailFromFile(book.path);
            const newBook = await db.updateBookThumbnail(
              book.path,
              thumbnailPath
            );
            // サムネイル更新イベント
            this.emitBookUpdated(newBook);
          } catch (err) {
            console.error(err);
          }
        }
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

    ipcMain.handle(
      "open-file",
      (_event: IpcMainInvokeEvent, filePath: string) => openFile(filePath)
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

    ipcMain.handle(
      "move-to-trash",
      (_event: IpcMainInvokeEvent, path: string) => shell.trashItem(path)
    );
  }
}

export const bridge = new Bridge();
