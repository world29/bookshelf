import { IpcRendererEvent } from "electron";

import { FileInfo } from "./lib/file";

export interface IElectronAPI {
  onFileAdded: (
    callback: (event: IpcRendererEvent, fileInfo: FileInfo) => void
  ) => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
