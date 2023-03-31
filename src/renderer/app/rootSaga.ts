import { all } from "redux-saga/effects";

import counterSagas from "../features/counter/counterSagas";
import booksSagas from "../features/books/booksSagas";

export default function* rootSaga() {
  yield all([...counterSagas, ...booksSagas]);
}
