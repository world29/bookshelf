import { IpcRendererEvent } from "electron";

export interface IWorkerAPI {
  doThing: () => Promise<string>;
  handleSendMessage: (
    callback: (_event: IpcRendererEvent, text: string) => void
  ) => void;
}

declare global {
  interface Window {
    workerAPI: IWorkerAPI;
  }
}
