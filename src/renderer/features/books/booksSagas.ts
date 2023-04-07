import { takeLatest, put, select, call, takeEvery } from "redux-saga/effects";

import { Book } from "../../../models/book";
import {
  booksFetched,
  bookUpdated,
  bookAdded,
  bookRemoved,
  fetchBooks,
  selectBook,
  updateBook,
  addBook,
  addBooks,
  removeBook,
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

  const newBook: Book = yield call(window.electronAPI.addBook, path);

  yield put(bookAdded(newBook));
}

function* handleAddBooks(action: { payload: { filePaths: string[] } }) {
  const { filePaths } = action.payload;

  for (const path of filePaths) {
    try {
      const newBook: Book = yield call(window.electronAPI.addBook, path);

      yield put(bookAdded(newBook));
    } catch (err) {
      console.error(err);
    }
  }
}

function* handleRemoveBook(action: { payload: { path: string } }) {
  const { path } = action.payload;

  const removedPath: string = yield call(window.electronAPI.removeBook, path);

  yield put(bookRemoved(removedPath));
}

function* updateBookThumbnail(action: { payload: Book }) {
  const { path } = action.payload;

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
}

export default [
  takeLatest(updateBook, handleUpdateBook),
  takeLatest(fetchBooks, handleFetchBooks),
  takeLatest(addBook, handleAddBook),
  takeLatest(addBooks, handleAddBooks),
  takeLatest(removeBook, handleRemoveBook),
  // ファイルが追加されたらサムネイル生成を行う
  takeEvery(bookAdded, updateBookThumbnail),
];
