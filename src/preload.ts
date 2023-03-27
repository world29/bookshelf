import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  doThing: () => ipcRenderer.send("do-a-thing"),
});
