export type Book = {
  path: string;
  title: string;
  author: string;
  thumbnailPath: string;
  modifiedTime: string; // ファイルの最終変更日時 (ISO 8601 format)
  registeredTime: string;
  rating: number;
};
