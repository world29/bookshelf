export interface BookInfo {
  title: string;
  score: number;
  fileSize: number;
  filePath: string;
  fileHash: string;
}

export interface IBookRepository {
  /**
   * 複数ファイルの登録を要求する
   */
  requestAddFiles: (filePaths: string[]) => void;

  /**
   * ファイルを登録から削除する (ファイルシステムからは削除しない)
   */
  removeFile: (filePath: string) => Promise<void>;

  /**
   * 登録された本の取得
   */
  getBooks: () => Promise<BookInfo[]>;

  /**
   * タイトルの設定
   */
  setBookTitle: (filePath: string, title: string) => Promise<BookInfo>;

  /**
   * スコアの設定
   */
  setBookScore: (filePath: string, score: number) => Promise<BookInfo>;
}
