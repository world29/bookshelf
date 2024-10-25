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
