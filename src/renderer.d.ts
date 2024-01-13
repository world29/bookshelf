import { IpcRendererEvent } from "electron";
import { Book } from "./models/book";
import { OpenFileType } from "./models/dialog";
import { Settings } from "./models/settings";
import { FilterByRating, FilterByTag } from "./models/filter";
import { BookFileInfo } from "./main/book";

export interface IElectronAPI {
  doThing: () => Promise<string>;
  findBooks: (searchQuery: string) => Promise<Book[]>;
  getBookCount: () => Promise<number>;
  filterAndFetchBooks: (
    keyword: string,
    tag: FilterByTag,
    rating: FilterByRating,
    order: SortBy,
    count: number,
    offset: number
  ) => Promise<{
    filterResult: { count: number };
    fetchResult: { books: Book[] };
  }>;
  updateBook: (path: string, title: string, author: string) => Promise<Book>;
  updateBookThumbnail: (path: string, thumbnailPath: string) => Promise<Book>;
  updateBookRating: (path: string, rating: number) => Promise<Book>;
  addBook: (path: string) => Promise<Book>;
  addBooks: (paths: string[]) => Promise<void>;
  removeBook: (path: string) => Promise<string>;
  createThumbnail: (path: string) => Promise<string>;
  openFile: (path: string) => Promise<void>;
  getSettings: () => Promise<Settings>;
  setSettingsViewer: (path: sting) => Promise<void>;
  openFileDialog: (
    fileType: OpenFileType
  ) => Promise<Electron.OpenDialogReturnValue>;
  showItemInFolder: (path: string) => Promise<void>;
  moveToTrash: (path: string) => Promise<void>;
  // メインからレンダラープロセス
  handleOpenSettings: (callback: () => void) => void;
  handleProgressBooksAdded: (
    callback: (_event: IpcRendererEvent, books: Book[]) => void
  ) => void;
  handleProgressBookAddFailed: (
    callback: (_event: IpcRendererEvent, fileInfo: BookFileInfo) => void
  ) => void;
  handleProgressBookUpdated: (
    callback: (_event: IpcRendererEvent, book: Book) => void
  ) => void;
  handleProgressThumbnailGenerationStarted: (
    callback: (_event: IpcRendererEvent, fileCount: number) => void
  ) => void;
  handleProgressThumbnailGenerationProgress: (
    callback: (
      _event: IpcRendererEvent,
      generatedCount: number,
      fileCount: number
    ) => void
  ) => void;
  handleProgressThumbnailGenerationCompleted: (
    callback: (_event: IpcRendererEvent) => void
  ) => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
