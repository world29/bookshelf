import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  doThing: () => ipcRenderer.invoke("do-a-thing"),
});
