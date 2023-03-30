﻿import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  doThing: () => ipcRenderer.invoke("do-a-thing"),
  findBooks: (searchQuery: string) =>
    ipcRenderer.invoke("find-books", searchQuery),
});
