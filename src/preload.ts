import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  onFileAdded: (callback: (event: IpcRendererEvent, files: string[]) => void) =>
    ipcRenderer.on("file-added", callback),
});
