import { IpcRendererEvent } from "electron";

import { BookInfo } from "./lib/file";

export interface IElectronAPI {
  onBookAdded: (
    callback: (event: IpcRendererEvent, bookInfo: BookInfo) => void
  ) => void;
  removeFile: (filePath: string) => Promise<void>;
  getBooks: () => Promise<BookInfo[]>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
