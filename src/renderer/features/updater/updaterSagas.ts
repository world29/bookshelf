import { eventChannel } from "redux-saga";
import { call, fork, put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";

import {
  checkingForUpdate,
  downloadProgress,
  updateAvailable,
  updateDownloaded,
  updateError,
  updateNotAvailable,
  UpdaterActionsType,
} from "./updaterActions";
import {
  UpdaterError,
  UpdaterProgressInfo,
  UpdaterUpdateInfo,
} from "../../../models/autoUpdater";
import { MessageBoxReturnValue } from "electron";

function* watchUpdaterEvent() {
  const channel = eventChannel((emit) => {
    window.electronAPI.handleUpdaterEvent((_event, updaterEvent, info?) => {
      switch (updaterEvent) {
        case "checking-for-update":
          emit(checkingForUpdate());
          break;
        case "update-available":
          emit(updateAvailable(info as UpdaterUpdateInfo));
          break;
        case "update-not-available":
          emit(updateNotAvailable(info as UpdaterUpdateInfo));
          break;
        case "download-progress":
          emit(downloadProgress(info as UpdaterProgressInfo));
          break;
        case "update-downloaded":
          emit(updateDownloaded(info as UpdaterUpdateInfo));
          break;
        case "error":
          emit(updateError(info as UpdaterError));
          break;
        default:
          break;
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  });

  // アプリ起動時のアップデートチェック
  window.electronAPI.checkForUpdatesAndNotify();

  yield takeEvery(channel, dispatchUpdaterEvent);
}

function* dispatchUpdaterEvent(action: UpdaterActionsType) {
  yield put(action);
}

function* handleUpdateDownloaded(action: ReturnType<typeof updateDownloaded>) {
  console.log("handleUpdateDownloaded");

  const value: MessageBoxReturnValue = yield call(
    window.electronAPI.showMessageBox,
    {
      message: `New version (${action.payload.version}) downloaded.\nQuit and install.`,
    }
  );

  if (value.response === 0) {
    window.electronAPI.quitAndInstall();
  }
}

export default [
  fork(watchUpdaterEvent),
  takeEvery(updateDownloaded.type, handleUpdateDownloaded),
];
