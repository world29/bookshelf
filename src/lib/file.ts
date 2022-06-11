export interface FileInfo {
  fileSize: number;
  filePath: string;
  fileHash: string;
}

export interface IFileRegistry {
  /**
   * 複数ファイルの登録を要求する
   */
  requestAddFiles: (filePaths: string[]) => void;
}
