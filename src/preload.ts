import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

import { BookInfo } from "./lib/book";

contextBridge.exposeInMainWorld("electronAPI", {
  // メインからレンダラーへ
  onBookAdded: (
    callback: (event: IpcRendererEvent, bookInfo: BookInfo[]) => void
  ) => ipcRenderer.on("book-added", callback),
  // レンダラーからメインへ
  removeFile: (filePath: string) => ipcRenderer.invoke("remove-file", filePath),
  getBooks: () => ipcRenderer.invoke("get-books"),
});
