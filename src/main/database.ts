import { app } from "electron";
import sqlite3 from "sqlite3";
import { join } from "path";
import { Book } from "../models/book";
import { BookFileInfo } from "./book";
import {
  FilterByRating,
  FilterByTag,
  FILTER_BY_RATING,
  FILTER_BY_TAG,
} from "../models/filter";

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

function getBookCount(): Promise<number> {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT COUNT(*) AS count FROM books",
      (err: Error | null, row: { count: number }) => {
        if (err) reject(err);
        console.log(row);

        resolve(row.count);
      }
    );
  });
}

function fetchBooks(
  keyword: string,
  tag: FilterByTag,
  rating: FilterByRating,
  count: number,
  offset: number
): Promise<{ books: Book[]; total: number }> {
  return new Promise((resolve, reject) => {
    let query = `FROM books WHERE (title LIKE '%${keyword}%' OR author LIKE '%${keyword}%')`;

    if (tag === FILTER_BY_TAG.TAGGED) {
      query += " AND (author <> '')";
    } else if (tag === FILTER_BY_TAG.UNTAGGED) {
      query += " AND (author == '')";
    }

    if (rating === FILTER_BY_RATING.EXCELLENT) {
      query += " AND (rating == 5)";
    } else if (rating === FILTER_BY_RATING.GOOD) {
      query += " AND (rating == 4)";
    } else if (rating === FILTER_BY_RATING.OK) {
      query += " AND (rating == 3)";
    } else if (rating === FILTER_BY_RATING.POOR) {
      query += " AND (rating == 2)";
    } else if (rating === FILTER_BY_RATING.VERY_BAD) {
      query += " AND (rating == 1)";
    } else if (rating === FILTER_BY_RATING.UNRATED) {
      query += " AND (rating == 0)";
    }

    db.serialize(() => {
      let totalCount = 0;
      db.get(
        `SELECT COUNT(*) AS count ${query}`,
        (err: Error | null, row: { count: number }) => {
          if (err) reject(err);

          totalCount = row.count;
        }
      );

      query += ` LIMIT ${count} OFFSET ${offset}`;

      db.all(`SELECT * ${query}`, (err: Error, rows: Row[]) => {
        if (err) reject(err);

        resolve({ books: rows, total: totalCount });
      });
    });
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
  getBookCount,
  fetchBooks,
  updateBook,
  updateBookThumbnail,
  updateBookRating,
  addBook,
  addBooks,
  removeBook,
};
