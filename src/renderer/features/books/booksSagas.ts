import { takeLatest, put, select, call } from "redux-saga/effects";

import { Book } from "../../../models/book";
import {
  booksFetched,
  bookUpdated,
  bookAdded,
  fetchBooks,
  selectBook,
  updateBook,
  addBook,
} from "./booksSlice";

function* handleUpdateBook(action: {
  payload: { path: string; title: string; author: string };
}) {
  const { path, title, author } = action.payload;

  const book: Book | undefined = yield select(selectBook(path));

  if (!book) {
    //error
    return;
  }

  const newBook: Book = yield call(
    window.electronAPI.updateBook,
    path,
    title,
    author
  );

  yield put(bookUpdated(newBook));
}

function* handleFetchBooks() {
  const books: Book[] = yield call(window.electronAPI.findBooks, "");

  yield put(booksFetched(books));
}

function* handleAddBook(action: { payload: { path: string } }) {
  const { path } = action.payload;

  {
    const newBook: Book = yield call(window.electronAPI.addBook, path);

    yield put(bookAdded(newBook));
  }

  // アーカイブファイルなら、先頭の画像ファイルをサムネイルに設定する。
  if (path.endsWith(".zip")) {
    const thumbnailPath: string = yield call(
      window.electronAPI.createThumbnail,
      path
    );

    const newBook: Book = yield call(
      window.electronAPI.updateBookThumbnail,
      path,
      thumbnailPath
    );

    yield put(bookUpdated(newBook));
  }

  // 画像ファイルなら、それをサムネイルに設定する。
  if (path.endsWith(".png")) {
    const newBook: Book = yield call(
      window.electronAPI.updateBookThumbnail,
      path,
      path
    );

    yield put(bookUpdated(newBook));
  }
}

export default [
  takeLatest(updateBook, handleUpdateBook),
  takeLatest(fetchBooks, handleFetchBooks),
  takeLatest(addBook, handleAddBook),
];
