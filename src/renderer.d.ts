import { Book } from "./models/book";

export interface IElectronAPI {
  doThing: () => Promise<string>;
  findBooks: (searchQuery: string) => Promise<Book[]>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
