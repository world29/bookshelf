import { all } from "redux-saga/effects";

import booksSagas from "../features/books/booksSagas";

export default function* rootSaga() {
  yield all([...booksSagas]);
}
