﻿import {
  contextBridge,
  ipcRenderer,
  IpcRendererEvent,
  MessageBoxOptions,
} from "electron";
import { Book } from "../models/book";

import { OpenFileType } from "../models/dialog";
import { FilterByRating, FilterByTag } from "../models/filter";
import { SortOrder } from "../models/sortOrder";
import {
  updaterChannel,
  UpdaterError,
  UpdaterEvents,
  UpdaterProgressInfo,
  UpdaterUpdateInfo,
} from "../models/autoUpdater";

contextBridge.exposeInMainWorld("electronAPI", {
  doThing: () => ipcRenderer.invoke("do-a-thing"),
  showMessageBox: (options: MessageBoxOptions) =>
    ipcRenderer.invoke("showMessageDialog", options),
  checkForUpdatesAndNotify: () =>
    ipcRenderer.invoke("checkForUpdatesAndNotify"),
  quitAndInstall: () => ipcRenderer.send("quitAndInstall"),
  findBooks: (searchQuery: string) =>
    ipcRenderer.invoke("find-books", searchQuery),
  getBookCount: () => ipcRenderer.invoke("get-book-count"),
  filterAndFetchBooks: (
    keyword: string,
    tag: FilterByTag,
    rating: FilterByRating,
    order: SortOrder,
    count: number,
    offset: number
  ) =>
    ipcRenderer.invoke(
      "filter-and-fetch-books",
      keyword,
      tag,
      rating,
      order,
      count,
      offset
    ),
  fetchBook: (path: string) => ipcRenderer.invoke("fetch-book", path),
  updateBook: (path: string, title: string, author: string) =>
    ipcRenderer.invoke("update-book", path, title, author),
  updateBookThumbnail: (path: string, thumbnailPath: string) =>
    ipcRenderer.invoke("update-book-thumbnail", path, thumbnailPath),
  updateBookRating: (path: string, rating: number) =>
    ipcRenderer.invoke("update-book-rating", path, rating),
  addBook: (path: string) => ipcRenderer.invoke("add-book", path),
  addBooks: (paths: string[]) => ipcRenderer.invoke("add-books", paths),
  removeBook: (path: string) => ipcRenderer.invoke("remove-book", path),
  createThumbnail: (path: string) =>
    ipcRenderer.invoke("create-thumbnail", path),
  openFile: (path: string) => ipcRenderer.invoke("open-file", path),
  getSettings: () => ipcRenderer.invoke("get-settings"),
  setSettingsDataDir: (path: string) =>
    ipcRenderer.invoke("set-settings-data-dir", path),
  setSettingsViewer: (path: string) =>
    ipcRenderer.invoke("set-settings-viewer", path),
  openFileDialog: (fileType: OpenFileType) =>
    ipcRenderer.invoke("open-file-dialog", fileType),
  showItemInFolder: (path: string) =>
    ipcRenderer.invoke("show-item-in-folder", path),
  moveToTrash: (path: string) => ipcRenderer.invoke("move-to-trash", path),
  // メインからレンダラープロセス
  handleUpdaterEvent: (
    callback: (
      _event: IpcRendererEvent,
      updaterEvent: UpdaterEvents,
      info?: UpdaterUpdateInfo | UpdaterProgressInfo | UpdaterError
    ) => void
  ) => ipcRenderer.on(updaterChannel, callback),
  handleOpenSettings: (callback: () => void) =>
    ipcRenderer.on("open-settings", callback),
  handleProgressBooksAdded: (
    callback: (_event: IpcRendererEvent, books: Book[]) => void
  ) => ipcRenderer.on("progress:booksAdded", callback),
  handleProgressBookAddFailed: (
    callback: (_event: IpcRendererEvent, path: string, error: string) => void
  ) => ipcRenderer.on("progress:bookAddFailed", callback),
  handleProgressBookUpdated: (
    callback: (_event: IpcRendererEvent, book: Book) => void
  ) => ipcRenderer.on("progress:bookUpdated", callback),
  handleProgressThumbnailGenerationStarted: (
    callback: (_event: IpcRendererEvent, fileCount: number) => void
  ) => ipcRenderer.on("progress:thumbnailGenerationStarted", callback),
  handleProgressThumbnailGenerationProgress: (
    callback: (
      _event: IpcRendererEvent,
      generatedCount: number,
      fileCount: number
    ) => void
  ) => ipcRenderer.on("progress:thumbnailGenerationProgress", callback),
  handleProgressThumbnailGenerationCompleted: (
    callback: (_event: IpcRendererEvent) => void
  ) => ipcRenderer.on("progress:thumbnailGenerationCompleted", callback),
});
