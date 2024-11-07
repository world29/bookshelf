import { all } from "redux-saga/effects";

import booksSagas from "../features/books/booksSagas";
import updaterSagas from "../features/updater/updaterSagas";

export default function* rootSaga() {
  yield all([...booksSagas, ...updaterSagas]);
}
