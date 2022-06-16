import fs from "fs";
import crypt from "crypto";
import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import sqlite3 from "sqlite3";
import { join, basename } from "path";

import { BookInfo, BookPropertyKeyValue, IBookRepository } from "../lib/book";

ipcMain.handle("remove-file", (_event: IpcMainInvokeEvent, filePath: string) =>
  bookRepository.removeFile(filePath)
);

ipcMain.handle("get-books", () => bookRepository.getBooks());

ipcMain.handle(
  "set-book-title",
  (_event: IpcMainInvokeEvent, filePath: string, title: string) =>
    bookRepository.setBookTitle(filePath, title)
);

ipcMain.handle(
  "set-book-score",
  (_event: IpcMainInvokeEvent, filePath: string, score: number) =>
    bookRepository.setBookScore(filePath, score)
);

ipcMain.handle(
  "set-book-properties",
  (
    _event: IpcMainInvokeEvent,
    filePath: string,
    properties: BookPropertyKeyValue
  ) => bookRepository.setBookProperties(filePath, properties)
);

// ファイル情報
export interface FileInfo {
  fileSize: number;
  filePath: string;
  fileHash: string;
}

// 本の情報
interface BookRecord {
  file_path: string;
  file_size: number;
  file_hash: string;
  title: string;
  author: string;
  score: number;
}

function recordToInfo(row: BookRecord): BookInfo {
  return {
    title: row.title,
    author: row.author,
    score: row.score,
    filePath: row.file_path,
    fileSize: row.file_size,
    fileHash: row.file_hash,
  };
}

// レンダラープロセスに登録のメッセージを送る
const sendBookAdded = (bookInfo: BookInfo) => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.webContents.send("book-added", bookInfo);
  }
};

class BookRepository implements IBookRepository {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(this.databasePath);
  }

  get databasePath() {
    return join(app.getPath("userData"), "books.db");
  }

  initialize() {
    this.db.run(
      "CREATE TABLE IF NOT EXISTS books(file_path, file_size, file_hash, title, author TEXT DEFAULT '', score INTEGER DEFAULT 0)"
    );
  }

  finalize() {
    this.db.close();
  }

  requestAddFiles(filePaths: string[]) {
    filePaths.forEach((filePath) =>
      this.loadFile(filePath).then((fileInfo) => {
        this.addFileToDB(fileInfo);
      })
    );
  }

  addFileToDB(fileInfo: FileInfo) {
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
      this.db.get(
        "SELECT * FROM books WHERE file_path = ?",
        fileInfo.filePath,
        (err, row) => {
          if (err) return;

          sendBookAdded(recordToInfo(row));
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

        resolve(rows.map<BookInfo>(recordToInfo));
      });
    });
  }

  setBookTitle(filePath: string, title: string) {
    return new Promise<BookInfo>((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(
          "UPDATE books set title = ? WHERE file_path = ?",
          title,
          filePath
        );
        this.db.get(
          "SELECT * FROM books WHERE file_path = ?",
          filePath,
          (err, row) => {
            if (err) reject(err);

            resolve(recordToInfo(row));
          }
        );
      });
    });
  }

  setBookScore(filePath: string, score: number) {
    return new Promise<BookInfo>((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(
          "UPDATE books set score = ? WHERE file_path = ?",
          score,
          filePath
        );
        this.db.get(
          "SELECT * FROM books WHERE file_path = ?",
          filePath,
          (err, row) => {
            if (err) reject(err);

            resolve(recordToInfo(row));
          }
        );
      });
    });
  }

  setBookProperties(
    filePath: string,
    properties: BookPropertyKeyValue
  ): Promise<BookInfo> {
    return new Promise<BookInfo>((resolve, reject) => {
      this.db.serialize(() => {
        //memo: DB のフィールド名と BookInfo のプロパティ名が異なる場合は変換が必要
        const fieldsNameQuery = Object.keys(properties)
          .map((key) => `${key} = ?`)
          .join(",");

        this.db.run(
          `UPDATE books set ${fieldsNameQuery} WHERE file_path = ?`,
          ...Object.values(properties),
          filePath
        );

        this.db.get(
          "SELECT * FROM books WHERE file_path = ?",
          filePath,
          (err, row) => {
            if (err) reject(err);

            resolve(recordToInfo(row));
          }
        );
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

const bookRepository = new BookRepository();

bookRepository.initialize();

export default bookRepository;
