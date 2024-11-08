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
  createBookThumbnail,
  updateBookRating,
  createBookThumbnailAll,
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

  try {
    yield call(window.electronAPI.addBooks, filePaths);
  } catch (err) {
    console.error(err);
  }
}

function* handleRemoveBook(action: { payload: { path: string } }) {
  const { path } = action.payload;

  const removedPath: string = yield call(window.electronAPI.removeBook, path);

  yield put(bookRemoved(removedPath));
}

function* handleCreateBookThumbnail(action: { payload: { path: string } }) {
  const { path } = action.payload;

  try {
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
  } catch (err) {
    console.error(err);
  }
}

function* handleCreateBookThumbnailAll() {
  const books: Book[] = yield select((state) => state.books);

  const bookPaths = books
    .filter((book) => book.thumbnailPath === "")
    .map((book) => book.path);

  for (const bookPath of bookPaths) {
    try {
      const thumbnailPath: string = yield call(
        window.electronAPI.createThumbnail,
        bookPath
      );

      const newBook: Book = yield call(
        window.electronAPI.updateBookThumbnail,
        bookPath,
        thumbnailPath
      );

      yield put(bookUpdated(newBook));
    } catch (err) {
      console.error(err);
    }
  }
}

function* handleUpdateBookRating(action: {
  payload: { path: string; rating: number };
}) {
  const { path, rating } = action.payload;

  try {
    const newBook: Book = yield call(
      window.electronAPI.updateBookRating,
      path,
      rating
    );

    yield put(bookUpdated(newBook));
  } catch (err) {
    console.error(err);
  }
}

function* handleBookAdded(action: { payload: { path: string } }) {
  // ファイルが追加されたら(自動的に)サムネイル生成を行う
  yield handleCreateBookThumbnail(action);
}

export default [
  takeLatest(updateBook, handleUpdateBook),
  takeLatest(fetchBooks, handleFetchBooks),
  takeLatest(addBook, handleAddBook),
  takeLatest(addBooks, handleAddBooks),
  takeLatest(removeBook, handleRemoveBook),
  takeEvery(createBookThumbnail, handleCreateBookThumbnail),
  takeLatest(createBookThumbnailAll, handleCreateBookThumbnailAll),
  takeLatest(updateBookRating, handleUpdateBookRating),
  takeEvery(bookAdded, handleBookAdded),
];
