import {
  BrowserWindow,
  dialog,
  ipcMain,
  IpcMainInvokeEvent,
  shell,
} from "electron";
import { join, basename, dirname, extname, sep } from "path";
import { rename, mkdir } from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";

import { OpenFileType } from "../models/dialog";
import db, { BookFileInfoWithId } from "./database";
import settingsStore from "./settings";
import { openFile } from "./shell";
import { BookFileInfo, getBookFileInfo } from "./book";
import { Book } from "../models/book";
import { FilterByRating, FilterByTag } from "../models/filter";
import { SortOrder } from "../models/sortOrder";
import bridge_worker from "./bridge_worker";
import { ThumbnailCreationDesc } from "../models/worker";
import { existsSync } from "original-fs";

// レンダラープロセスとの IPC 通信のセットアップ
// レンダラープロセスへイベントを送信するための API を公開
class Bridge {
  private window: BrowserWindow | null;

  constructor() {
    this.window = null;
  }

  /** 指定したファイルからサムネイルを生成する */
  async createThumbnail(path: string): Promise<string> {
    const desc: ThumbnailCreationDesc = {
      path: path,
      out_dir: dirname(path),
      width: 256,
      height: 362,
    };
    return bridge_worker.createThumbnail(desc);
  }

  emitBooksAdded(books: Book[]) {
    this.window?.webContents.send("progress:booksAdded", books);
  }

  emitBookAddFailed(fileInfo: BookFileInfo, error: string) {
    this.window?.webContents.send("progress:bookAddFailed", fileInfo, error);
  }

  emitBookUpdated(book: Book) {
    this.window?.webContents.send("progress:bookUpdated", book);
  }

  emitThumbnailGenerationStarted(fileCount: number) {
    this.window?.webContents.send(
      "progress:thumbnailGenerationStarted",
      fileCount
    );
  }

  emitThumbnailGenerationProgress(generatedCount: number, fileCount: number) {
    this.window?.webContents.send(
      "progress:thumbnailGenerationProgress",
      generatedCount,
      fileCount
    );
  }

  emitThumbnailGenerationCompleted() {
    this.window?.webContents.send("progress:thumbnailGenerationCompleted");
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

    ipcMain.handle("fetch-book", (_event: IpcMainInvokeEvent, path: string) =>
      db.getBookByPath(path)
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
        const files_dir = join(settingsStore.get("data_dir"), "files");

        const promises = paths.map((path) => getBookFileInfo(path));

        const results = await Promise.allSettled(promises);

        // ファイル情報の取得に成功したものだけデータベースに登録する
        const fullfilledResults = results.filter(
          (result) => result.status === "fulfilled"
        ) as PromiseFulfilledResult<BookFileInfo>[];

        const bookInfos = fullfilledResults.map((result) => result.value);

        //todo: ユニーク ID を割り当てて data_dir 以下に移動する
        const bookInfoWithIds: BookFileInfoWithId[] = [];
        for (const info of bookInfos) {
          let id = uuidv4();

          // すでに data_dir 以下のファイルを登録しようとした場合は、親ディレクトリから id を抽出する。
          // data_dir 以下に配置されていても、データベースから削除済みの場合があるため、この時点ではエラーにしない。
          if (info.path.includes(files_dir)) {
            // 親ディレクトリの名前を取得する
            console.log(`file already in files_dir: ${info.path}`);
            const dir_entries = dirname(info.path).split(sep);
            id = dir_entries[dir_entries.length - 1];
            console.log(id);
          }

          // zip ファイルかフォルダのみ対応する
          const is_zip = extname(info.path);
          const is_folder = info.stats.isDirectory();

          if (!is_zip && !is_folder) {
            this.emitBookAddFailed(
              info,
              `file must be zip or folder: ${info.path}`
            );
            continue;
          }

          // uuid にもとづくフォルダを作成し、移動する
          const new_dir = join(files_dir, id);
          await mkdir(new_dir, { recursive: true }).catch((err) =>
            console.log(err)
          );

          // data_dir 以下のファイルを登録する際は rename を行わない
          const new_path = join(new_dir, basename(info.path));
          if (existsSync(new_path)) {
            bookInfoWithIds.push(Object.assign(info, { id, path: new_path }));
          } else {
            console.log(`renaming: ${info.path} -> ${new_path}`);

            await rename(info.path, new_path)
              .then(() => {
                bookInfoWithIds.push(
                  Object.assign(info, { id, path: new_path })
                );
              })
              .catch((err) => {
                console.log(err);
                this.emitBookAddFailed(info, err.message);
              });
          }
        }

        const { succeeded, failed } = await db.addBooks(bookInfoWithIds);
        // ファイル一括登録イベント
        if (succeeded.length > 0) {
          this.emitBooksAdded(succeeded);
        }
        for (const failedInfo of failed) {
          this.emitBookAddFailed(failedInfo.book, failedInfo.error);
        }

        // サムネイルを一つずつ作成する
        if (succeeded.length > 0) {
          this.emitThumbnailGenerationStarted(succeeded.length);

          let generatedCount = 0;
          for (const book of succeeded) {
            try {
              const thumbnailPath = await this.createThumbnail(book.path);
              const newBook = await db.updateBookThumbnail(
                book.path,
                thumbnailPath
              );
              // サムネイル更新イベント
              this.emitBookUpdated(newBook);

              generatedCount += 1;
              this.emitThumbnailGenerationProgress(
                generatedCount,
                succeeded.length
              );
            } catch (err) {
              console.error(err);
            }
          }

          this.emitThumbnailGenerationCompleted();
        }
      }
    );

    ipcMain.handle("remove-book", (_event: IpcMainInvokeEvent, path: string) =>
      db.removeBook(path)
    );

    ipcMain.handle(
      "create-thumbnail",
      (_event: IpcMainInvokeEvent, filePath: string) => {
        try {
          const outPath = this.createThumbnail(filePath);
          return outPath;
        } catch (err) {
          console.log(err);
          throw err;
        }
      }
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
      "set-settings-data-dir",
      (_event: IpcMainInvokeEvent, data_dir: string) =>
        new Promise<void>((resolve) => {
          settingsStore.set("data_dir", data_dir);
          resolve();
        })
    );

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
