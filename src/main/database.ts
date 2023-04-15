﻿import { app } from "electron";
import sqlite3 from "sqlite3";
import { join } from "path";
import { Book } from "../models/book";
import { BookFileInfo } from "./book";

const databasePath: string = join(app.getPath("userData"), "books.db");

const db = new sqlite3.Database(databasePath);

type Row = {
  path: string;
  title: string;
  author: string;
  thumbnailPath: string;
  modifiedTime: string;
  registeredTime: string;
  rating: number;
};

// データベース初期化
function initialize() {
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS books(
        path TEXT UNIQUE,
        title TEXT,
        author TEXT DEFAULT '',
        thumbnailPath TEXT DEFAULT '',
        modifiedTime TEXT DEFAULT '',
        registeredTime TEXT DEFAULT ''
      )`
    );
    // カラムを追加する。すでにカラムが存在する場合はエラーになるためコールバックを渡しておく。
    db.run(
      "ALTER TABLE books ADD COLUMN rating INTEGER DEFAULT 0",
      (err: Error | null) => {
        if (err) console.error(err);
      }
    );
  });
}

// データベース終了
function finalize() {
  db.close();
}

function findBooks(searchQuery: string): Promise<Book[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM books WHERE title LIKE '%${searchQuery}%' OR author LIKE '%${searchQuery}%'`,
      (err: Error, rows: Row[]) => {
        if (err) reject(err);

        resolve(rows);
      }
    );
  });
}

function updateBook(
  path: string,
  title: string,
  author: string
): Promise<Book> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        "UPDATE books SET title = ?, author = ? WHERE path = ?",
        title,
        author,
        path
      );
      db.get(
        "SELECT * FROM books WHERE path = ?",
        path,
        (err: Error | null, row: Row) => {
          if (err) reject(err);

          resolve(row);
        }
      );
    });
  });
}

function updateBookThumbnail(
  path: string,
  thumbnailPath: string
): Promise<Book> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        "UPDATE books SET thumbnailPath = ? WHERE path = ?",
        thumbnailPath,
        path
      );
      db.get(
        "SELECT * FROM books WHERE path = ?",
        path,
        (err: Error | null, row: Row) => {
          if (err) reject(err);

          resolve(row);
        }
      );
    });
  });
}

function updateBookRating(path: string, rating: number): Promise<Book> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("UPDATE books SET rating = ? WHERE path = ?", rating, path);
      db.get(
        "SELECT * FROM books WHERE path = ?",
        path,
        (err: Error | null, row: Row) => {
          if (err) reject(err);

          resolve(row);
        }
      );
    });
  });
}

function addBook(
  path: string,
  title: string,
  modifiedTime: string
): Promise<Book> {
  const registeredTime = new Date(Date.now()).toISOString();

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        "INSERT OR FAIL INTO books (path, title, modifiedTime, registeredTime) VALUES(?, ?, ?, ?)",
        path,
        title,
        modifiedTime,
        registeredTime,
        (err: Error | null) => {
          if (err) reject(err);
        }
      );
      db.get(
        "SELECT * FROM books WHERE path = ?",
        path,
        (err: Error | null, row: Row) => {
          if (err) reject(err);

          resolve(row);
        }
      );
    });
  });
}

function addBooks(bookInfos: BookFileInfo[]): Promise<Book[]> {
  return new Promise((resolve, reject) => {
    const registeredTime = new Date(Date.now()).toISOString();

    db.serialize(() => {
      const stmt = db.prepare(
        "INSERT OR FAIL INTO books (path, title, modifiedTime, registeredTime) VALUES(?, ?, ?, ?)"
      );

      for (const info of bookInfos) {
        stmt.run(info.path, info.title, info.modifiedTime, registeredTime);
      }

      stmt.finalize();

      db.each("SELECT * FROM books", (err: Error | null, row: Row) => {
        console.log(row);
      });

      db.all(
        "SELECT * FROM books WHERE registeredTime = ?",
        registeredTime,
        (err: Error | null, rows: Row[]) => {
          if (err) reject(err);

          resolve(rows);
        }
      );
    });
  });
}

function removeBook(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM books WHERE path = ?", path, (err: Error | null) => {
      if (err) reject(err);

      resolve(path);
    });
  });
}

export default {
  initialize,
  finalize,
  findBooks,
  updateBook,
  updateBookThumbnail,
  updateBookRating,
  addBook,
  addBooks,
  removeBook,
};
