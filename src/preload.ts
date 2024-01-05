import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { Book } from "./models/book";

import { OpenFileType } from "./models/dialog";
import { FilterByRating, FilterByTag } from "./models/filter";
import { SortBy } from "./models/sort";

contextBridge.exposeInMainWorld("electronAPI", {
  doThing: () => ipcRenderer.invoke("do-a-thing"),
  findBooks: (searchQuery: string) =>
    ipcRenderer.invoke("find-books", searchQuery),
  getBookCount: () => ipcRenderer.invoke("get-book-count"),
  filterAndFetchBooks: (
    keyword: string,
    tag: FilterByTag,
    rating: FilterByRating,
    order: SortBy,
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
  setSettingsViewer: (path: string) =>
    ipcRenderer.invoke("set-settings-viewer", path),
  openFileDialog: (fileType: OpenFileType) =>
    ipcRenderer.invoke("open-file-dialog", fileType),
  showItemInFolder: (path: string) =>
    ipcRenderer.invoke("show-item-in-folder", path),
  moveToTrash: (path: string) => ipcRenderer.invoke("move-to-trash", path),
  // メインからレンダラープロセス
  handleOpenSettings: (callback: () => void) =>
    ipcRenderer.on("open-settings", callback),
  handleProgressBooksAdded: (
    callback: (_event: IpcRendererEvent, books: Book[]) => void
  ) => ipcRenderer.on("progress:booksAdded", callback),
  handleProgressBookUpdated: (
    callback: (_event: IpcRendererEvent, book: Book) => void
  ) => ipcRenderer.on("progress:bookUpdated", callback),
});
