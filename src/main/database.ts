import { app } from "electron";
import sqlite3 from "sqlite3";
import { join, parse } from "path";
import { Book } from "../models/book";

const databasePath: string = join(app.getPath("userData"), "books.db");

const db = new sqlite3.Database(databasePath);

type Row = {
  path: string;
  title: string;
  author: string;
  thumbnailPath: string;
};

// データベース初期化
function initialize() {
  db.serialize(() => {
    db.run(
      "CREATE TABLE IF NOT EXISTS books(path TEXT, title TEXT, author TEXT DEFAULT '')"
    );
    // カラムを追加する。すでにカラムが存在する場合はエラーになるためコールバックを渡しておく。
    db.run(
      "ALTER TABLE books ADD COLUMN thumbnailPath TEXT DEFAULT ''",
      (result: sqlite3.RunResult, err: Error | null) => {
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
      db.get("SELECT * FROM books WHERE path = ?", path, (err, row: Row) => {
        if (err) reject(err);

        resolve(row);
      });
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

function addBook(path: string): Promise<Book> {
  return new Promise((resolve, reject) => {
    const title = parse(path).base;

    db.serialize(() => {
      db.run("INSERT INTO books (path, title) VALUES(?, ?)", path, title);
      db.get("SELECT * FROM books WHERE path = ?", path, (err, row: Row) => {
        if (err) reject(err);

        resolve(row);
      });
    });
  });
}

function removeBook(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM books WHERE path = ?",
      path,
      (result: sqlite3.RunResult, err: Error | null) => {
        if (err) reject(err);

        resolve(path);
      }
    );
  });
}

export default {
  initialize,
  finalize,
  findBooks,
  updateBook,
  updateBookThumbnail,
  addBook,
  removeBook,
};
