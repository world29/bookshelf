import { IpcRendererEvent } from "electron";

import { FileInfo } from "./lib/file";

export interface IElectronAPI {
  onFileAdded: (
    callback: (event: IpcRendererEvent, fileInfo: FileInfo) => void
  ) => void;
  removeFile: (filePath: string) => Promise<void>;
  getFiles: () => Promise<FileInfo[]>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
