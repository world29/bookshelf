﻿import {
  IpcRendererEvent,
  MessageBoxOptions,
  MessageBoxReturnValue,
} from "electron";
import { Book } from "./models/book";
import { OpenFileType } from "./models/dialog";
import { Settings } from "./models/settings";
import { FilterByRating, FilterByTag } from "./models/filter";
import {
  UpdaterError,
  UpdaterEvents,
  UpdaterProgressInfo,
  UpdaterUpdateInfo,
} from "../models/autoUpdater";
import { UpdateCheckResult } from "electron-updater";

export interface IElectronAPI {
  doThing: () => Promise<string>;
  showMessageBox: (
    options: MessageBoxOptions
  ) => Promise<MessageBoxReturnValue>;
  checkForUpdatesAndNotify: () => Promise<UpdateCheckResult>;
  quitAndInstall: () => void;
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
  fetchBook: (path: string) => Promise<Book>;
  updateBook: (path: string, title: string, author: string) => Promise<Book>;
  updateBookThumbnail: (path: string, thumbnailPath: string) => Promise<Book>;
  updateBookRating: (path: string, rating: number) => Promise<Book>;
  addBook: (path: string) => Promise<Book>;
  addBooks: (paths: string[]) => Promise<void>;
  removeBook: (path: string) => Promise<string>;
  createThumbnail: (path: string) => Promise<string>;
  openFile: (path: string) => Promise<void>;
  getSettings: () => Promise<Settings>;
  setSettingsDataDir: (path: sting) => Promise<void>;
  setSettingsViewer: (path: sting) => Promise<void>;
  openFileDialog: (
    fileType: OpenFileType
  ) => Promise<Electron.OpenDialogReturnValue>;
  showItemInFolder: (path: string) => Promise<void>;
  moveToTrash: (path: string) => Promise<void>;
  // メインからレンダラープロセス
  handleUpdaterEvent: (
    callback: (
      _event: IpcRendererEvent,
      updaterEvent: UpdaterEvents,
      info?: UpdaterUpdateInfo | UpdaterProgressInfo | UpdaterError
    ) => void
  ) => void;
  handleOpenSettings: (callback: () => void) => void;
  handleProgressBooksAdded: (
    callback: (_event: IpcRendererEvent, books: Book[]) => void
  ) => void;
  handleProgressBookAddFailed: (
    callback: (_event: IpcRendererEvent, path: string, error: string) => void
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
