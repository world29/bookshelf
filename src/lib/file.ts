﻿export interface FileInfo {
  fileSize: number;
  filePath: string;
  fileHash: string;
}

export interface BookInfo {
  title: string;
  fileInfo: FileInfo;
}

export interface IFileRegistry {
  /**
   * 複数ファイルの登録を要求する
   */
  requestAddFiles: (filePaths: string[]) => void;

  /**
   * ファイルをレジストリから削除する (ファイルシステムからは削除しない)
   */
  removeFile: (filePath: string) => Promise<void>;

  /**
   * 登録された本の取得
   */
  getBooks: () => Promise<BookInfo[]>;
}
