import { takeLatest, put, select, call } from "redux-saga/effects";

import { Book } from "../../../models/book";
import { RootState } from "../../app/store";
import {
  booksFetched,
  bookPropertiesUpdated,
  fetchBooks,
  setTitle,
} from "./booksSlice";

function* handleSetTitle(action: { payload: { path: string; title: string } }) {
  const { path, title } = action.payload;

  const book: Book = yield select((state: RootState) =>
    state.books.find((book) => book.path === path)
  );

  const newBook = { ...book, title: title };

  yield put(bookPropertiesUpdated(newBook));
}

function* handleFetchBooks() {
  const books: Book[] = yield call(window.electronAPI.findBooks, "");

  yield put(booksFetched(books));
}

export default [
  takeLatest(setTitle, handleSetTitle),
  takeLatest(fetchBooks, handleFetchBooks),
];
