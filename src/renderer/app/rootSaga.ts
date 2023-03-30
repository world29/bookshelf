import { all } from "redux-saga/effects";

import counterSagas from "../features/counter/counterSagas";

export default function* rootSaga() {
  yield all([...counterSagas]);
}
