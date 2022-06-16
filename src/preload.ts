import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

import { BookInfo, BookPropertyKeyValue } from "./lib/book";

contextBridge.exposeInMainWorld("electronAPI", {
  // メインからレンダラーへ
  onBookAdded: (
    callback: (event: IpcRendererEvent, bookInfo: BookInfo[]) => void
  ) => ipcRenderer.on("book-added", callback),
  // レンダラーからメインへ
  removeFile: (filePath: string) => ipcRenderer.invoke("remove-file", filePath),
  getBooks: () => ipcRenderer.invoke("get-books"),
  setBookTitle: (filePath: string, title: string) =>
    ipcRenderer.invoke("set-book-title", filePath, title),
  setBookScore: (filePath: string, score: number) =>
    ipcRenderer.invoke("set-book-score", filePath, score),
  setBookProperties: (filePath: string, properties: BookPropertyKeyValue) =>
    ipcRenderer.invoke("set-book-properties", filePath, properties),
});
