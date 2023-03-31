import { takeLatest, put, select, call } from "redux-saga/effects";

import { Book } from "../../../models/book";
import {
  booksFetched,
  bookUpdated,
  fetchBooks,
  selectBook,
  updateBook,
} from "./booksSlice";

function* handleUpdateBook(action: {
  payload: { path: string; title: string; author: string };
}) {
  const { path, title, author } = action.payload;

  const book: Book | undefined = yield select(selectBook, path);

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

export default [
  takeLatest(updateBook, handleUpdateBook),
  takeLatest(fetchBooks, handleFetchBooks),
];
