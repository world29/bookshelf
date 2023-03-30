import { app } from "electron";
import sqlite3 from "sqlite3";
import path from "path";
import { Book } from "../models/book";

const databasePath: string = path.join(app.getPath("userData"), "books.db");

const db = new sqlite3.Database(databasePath);

type Row = {
  path: string;
  title: string;
  author: string;
};

// データベース初期化
function initialize() {
  db.run(
    "CREATE TABLE IF NOT EXISTS books(path TEXT, title TEXT, author TEXT DEFAULT '')"
  );
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

export default {
  initialize,
  finalize,
  findBooks,
};
