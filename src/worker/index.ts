import { ipcRenderer, IpcRendererEvent } from "electron";
import {
  FolderToZipConversionDesc,
  ThumbnailCreationDesc,
} from "../models/worker";
import createThumbnail from "./thumbnail";
import folderToZip from "./folder-to-zip";

console.log("worker loaded.");

ipcRenderer.on(
  "worker:folderToZip",
  (_event: IpcRendererEvent, desc: FolderToZipConversionDesc) => {
    folderToZip(desc)
      .then(() => ipcRenderer.send("worker:folderToZipReply"))
      .catch((err) => ipcRenderer.send("worker:folderToZipReply", err));
  }
);

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
