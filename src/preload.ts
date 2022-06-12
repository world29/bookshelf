﻿import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

import { FileInfo } from "./lib/file";

contextBridge.exposeInMainWorld("electronAPI", {
  // メインからレンダラーへ
  onFileAdded: (
    callback: (event: IpcRendererEvent, fileInfo: FileInfo[]) => void
  ) => ipcRenderer.on("file-added", callback),
  // レンダラーからメインへ
  removeFile: (filePath: string) => ipcRenderer.invoke("remove-file", filePath),
  getFiles: () => ipcRenderer.invoke("get-files"),
});
