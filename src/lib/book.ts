export interface BookInfo {
  title: string;
  author: string;
  score: number;
  fileSize: number;
  filePath: string;
  fileHash: string;
}

/**
 * プロパティの値がとりうる型
 */
export type BookPropertyValue = string | number;

/**
 * 複数のプロパティをオブジェクト形式で保持する型
 */
export type BookPropertyKeyValue = { [key: string]: BookPropertyValue };

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
   * 著者一覧の取得
   * 重複を除いたリストを返します。
   */
  getAuthors: () => Promise<string[]>;

  /**
   * タイトルの設定
   */
  setBookTitle: (filePath: string, title: string) => Promise<BookInfo>;

  /**
   * スコアの設定
   */
  setBookScore: (filePath: string, score: number) => Promise<BookInfo>;

  /**
   * プロパティの一括設定
   */
  setBookProperties: (
    filePath: string,
    properties: BookPropertyKeyValue
  ) => Promise<BookInfo>;
}
