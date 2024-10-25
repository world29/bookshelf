import { ipcRenderer, IpcRendererEvent } from "electron";
import { ThumbnailCreationDesc } from "../models/worker";
import createThumbnail from "./thumbnail";

console.log("worker loaded.");

ipcRenderer.on(
  "worker:createThumbnail",
  (_event: IpcRendererEvent, desc: ThumbnailCreationDesc) => {
    createThumbnail(desc)
      .then((outPath) => {
        ipcRenderer.send("worker:createThumbnailReply", outPath);
      })
      .catch((err) => ipcRenderer.send("worker:createThumbnailReply", "", err));
  }
);
