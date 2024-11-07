/** フォルダのzip変換情報 */
export type FolderToZipConversionDesc = {
  /** 変換元のフォルダパス */
  folder_path: string;
  /** zip変換後のファイルパス */
  zip_path: string;
  /** 変換後に変換元フォルダを削除するか */
  delete_folder: boolean;
};

/** サムネイル作成情報 */
export type ThumbnailCreationDesc = {
  /** アーカイブファイルパス or フォルダパス */
  path: string;
  /** 出力ディレクトリ */
  out_dir: string;
  /** 生成するサムネイル画像の横幅 */
  width: number;
  /** 生成するサムネイル画像の高さ */
  height: number;
};
