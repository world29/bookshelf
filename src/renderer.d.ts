import { Book } from "./models/book";
import { Settings } from "./models/settings";

export interface IElectronAPI {
  doThing: () => Promise<string>;
  findBooks: (searchQuery: string) => Promise<Book[]>;
  updateBook: (path: string, title: string, author: string) => Promise<Book>;
  updateBookThumbnail: (path: string, thumbnailPath: string) => Promise<Book>;
  addBook: (path: string) => Promise<Book>;
  removeBook: (path: string) => Promise<string>;
  createThumbnail: (path: string) => Promise<string>;
  getSettings: () => Promise<Settings>;
  setSettingsViewer: (path: sting) => Promise<void>;
  openFileDialog: () => Promise<Electron.OpenDialogReturnValue>;
  handleOpenSettings: (callback: () => void) => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
