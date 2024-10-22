import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

contextBridge.exposeInMainWorld("workerAPI", {
  doThing: () => ipcRenderer.invoke("do-a-thing"),
  // メインからレンダラープロセス
  handleSendMessage: (
    callback: (_event: IpcRendererEvent, text: string) => void
  ) => ipcRenderer.on("worker:sendMessage", callback),
});
