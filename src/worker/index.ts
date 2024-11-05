import { ipcRenderer, IpcRendererEvent } from "electron";
import {
  FolderToZipConversionDesc,
  ThumbnailCreationDesc,
} from "../models/worker";
import createThumbnail from "./thumbnail";
import convertFolderToZip from "./folder-to-zip";

console.log("worker loaded.");

ipcRenderer.on(
  "worker:convertFolderToZip",
  (_event: IpcRendererEvent, desc: FolderToZipConversionDesc) => {
    convertFolderToZip(desc)
      .then((outPath) => {
        ipcRenderer.send("worker:convertFolderToZipReply", outPath);
      })
      .catch((err) =>
        ipcRenderer.send("worker:convertFolderToZipReply", "", err)
      );
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
