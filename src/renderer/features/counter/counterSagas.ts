import { takeLatest, delay, put } from "redux-saga/effects";

import {
  incrementFailed,
  incrementRequested,
  incrementSuccess,
} from "./counterSlice";

function* handleIncrementRequested() {
  yield delay(1000);
  if (Math.random() > 0.5) {
    yield put(incrementSuccess());
  } else {
    yield put(incrementFailed({ message: "failed!!!" }));
  }
}

export default [takeLatest(incrementRequested.type, handleIncrementRequested)];
