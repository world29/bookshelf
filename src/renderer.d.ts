import { Book } from "./models/book";

export interface IElectronAPI {
  doThing: () => Promise<string>;
  findBooks: (searchQuery: string) => Promise<Book[]>;
  updateBook: (path: string, title: string, author: string) => Promise<Book>;
  addBook: (path: string, title: string, author: string) => Promise<Book>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
