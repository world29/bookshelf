import { createAction } from "@reduxjs/toolkit";
import {
  UpdaterError,
  UpdaterProgressInfo,
  UpdaterUpdateInfo,
} from "../../../models/autoUpdater";

export const checkingForUpdate = createAction("updater/checkingForUpdate");

export const updateAvailable = createAction<UpdaterUpdateInfo>(
  "updater/updateAvailable"
);

export const updateNotAvailable = createAction<UpdaterUpdateInfo>(
  "update-not-available"
);

export const downloadProgress =
  createAction<UpdaterProgressInfo>("download-progress");

export const updateDownloaded =
  createAction<UpdaterUpdateInfo>("update-downloaded");

export const updateError = createAction<UpdaterError>("error");

export type UpdaterActionsType = ReturnType<
  | typeof checkingForUpdate
  | typeof updateAvailable
  | typeof updateNotAvailable
  | typeof downloadProgress
  | typeof updateDownloaded
  | typeof updateError
>;
