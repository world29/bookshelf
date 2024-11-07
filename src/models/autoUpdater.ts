export const updaterChannel = "autoUpdater";

export type UpdaterEvents =
  | "checking-for-update"
  | "update-available"
  | "update-not-available"
  | "download-progress"
  | "update-downloaded"
  | "error";

/** アップデート情報 */
export type UpdaterUpdateInfo = {
  version: string;
};

/** ダウンロード進捗情報 */
export type UpdaterProgressInfo = {
  percent: number;
};

/** エラー情報 */
export type UpdaterError = {
  name: string;
  message: string;
};
