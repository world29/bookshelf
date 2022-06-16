import { IpcRendererEvent } from "electron";

import { BookInfo, BookPropertyKeyValue } from "./lib/book";

export interface IElectronAPI {
  onBookAdded: (
    callback: (event: IpcRendererEvent, bookInfo: BookInfo) => void
  ) => void;
  removeFile: (filePath: string) => Promise<void>;
  getBooks: () => Promise<BookInfo[]>;
  getAuthors: () => Promise<string[]>;
  setBookTitle: (filePath: string, title: string) => Promise<BookInfo>;
  setBookScore: (filePath: string, score: number) => Promise<BookInfo>;
  setBookProperties: (
    filePath: string,
    properties: BookPropertyKeyValue
  ) => Promise<BookInfo>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
