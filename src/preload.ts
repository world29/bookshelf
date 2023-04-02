import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  doThing: () => ipcRenderer.invoke("do-a-thing"),
  findBooks: (searchQuery: string) =>
    ipcRenderer.invoke("find-books", searchQuery),
  updateBook: (path: string, title: string, author: string) =>
    ipcRenderer.invoke("update-book", path, title, author),
  updateBookThumbnail: (path: string, thumbnailPath: string) =>
    ipcRenderer.invoke("update-book-thumbnail", path, thumbnailPath),
  addBook: (path: string) => ipcRenderer.invoke("add-book", path),
  createThumbnail: (path: string) =>
    ipcRenderer.invoke("create-thumbnail", path),
  openFileDialog: () => ipcRenderer.invoke("open-file-dialog"),
});
