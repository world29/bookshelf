﻿import { Book } from "./models/book";

export interface IElectronAPI {
  doThing: () => Promise<string>;
  findBooks: (searchQuery: string) => Promise<Book[]>;
  updateBook: (path: string, title: string, author: string) => Promise<Book>;
  addBook: (path: string) => Promise<Book>;
  openFileDialog: () => Promise<Electron.OpenDialogReturnValue>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
