import fs from "fs";
import crypt from "crypto";
import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import sqlite3 from "sqlite3";
import { join, basename } from "path";

import { BookInfo, FileInfo, IFileRegistry } from "../lib/file";

ipcMain.handle("remove-file", (_event: IpcMainInvokeEvent, filePath: string) =>
  fileRegistry.removeFile(filePath)
);

ipcMain.handle("get-books", () => fileRegistry.getBooks());

interface BookRecord {
  file_path: string;
  file_size: number;
  file_hash: string;
  title: string;
  author: string;
  score: number;
}

// レンダラープロセスにファイル登録のメッセージを送る
const sendBookAdded = (bookInfo: BookInfo) => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.webContents.send("book-added", bookInfo);
  }
};

class FileRegistry implements IFileRegistry {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(this.databasePath);
  }

  get databasePath() {
    return join(app.getPath("userData"), "books.db");
  }

  initialize() {
    this.db.run(
      "CREATE TABLE IF NOT EXISTS books(file_path, file_size, file_hash, title, author, score)"
    );
  }

  finalize() {
    this.db.close();
  }

  requestAddFiles(filePaths: string[]) {
    filePaths.forEach((filePath) =>
      this.loadFile(filePath).then((fileInfo) => {
        this.addFile(fileInfo);
      })
    );
  }

  addFile(fileInfo: FileInfo) {
    const fileName = basename(fileInfo.filePath);

    this.db.serialize(() => {
      // レコードを追加
      this.db.run(
        "INSERT INTO books(file_path, file_size, file_hash) VALUES(?, ?, ?)",
        fileInfo.filePath,
        fileInfo.fileSize,
        fileInfo.fileHash
      );
      // タイトルを更新
      this.db.run(
        "UPDATE books SET title = ? WHERE file_path = ?",
        fileName,
        fileInfo.filePath
      );
      // 追加したレコードを取得してレンダラープロセスに通知する
      this.db.all(
        "SELECT * FROM books WHERE file_path = ?",
        fileInfo.filePath,
        (err, rows: BookRecord[]) => {
          if (err) return;
          if (rows.length > 0) {
            const bookInfo: BookInfo = {
              title: rows[0].title,
              fileInfo,
            };
            sendBookAdded(bookInfo);
          }
        }
      );
    });
  }

  removeFile(filePath: string) {
    return new Promise<void>((resolve) => {
      this.db.run("DELETE FROM books WHERE file_path = ?", filePath, () =>
        resolve()
      );
    });
  }

  getBooks() {
    return new Promise<BookInfo[]>((resolve, reject) => {
      this.db.all("SELECT * FROM books", (err: Error, rows: BookRecord[]) => {
        if (err) reject(err);

        const bookInfo = rows.map<BookInfo>((row) => ({
          title: row.title,
          fileInfo: {
            filePath: row.file_path,
            fileSize: row.file_size,
            fileHash: row.file_hash,
          },
        }));

        resolve(bookInfo);
      });
    });
  }

  loadFile(filePath: string): Promise<FileInfo> {
    return new Promise((resolve) => {
      const stat = fs.statSync(filePath);

      // compute md5 hash
      const md5 = crypt.createHash("md5");
      const fileContent = fs.readFileSync(filePath);
      const hash = md5.update(fileContent).digest("hex");

      const fileInfo: FileInfo = {
        filePath,
        fileSize: stat.size,
        fileHash: hash,
      };

      resolve(fileInfo);
    });
  }
}

const fileRegistry = new FileRegistry();

fileRegistry.initialize();

export default fileRegistry;
