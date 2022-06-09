import { IpcRendererEvent } from "electron";

export interface IElectronAPI {
  onFileAdded: (
    callback: (event: IpcRendererEvent, files: string[]) => void
  ) => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
