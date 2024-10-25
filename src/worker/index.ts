import { ipcRenderer, IpcRendererEvent } from "electron";
import { ThumbnailCreationDesc } from "../models/worker";
import { parse, join } from "path";

async function createThumbnail(desc: ThumbnailCreationDesc) {
  const fileName = parse(desc.path).base;
  return join(desc.out_dir, fileName);
}

console.log("hello worker");

ipcRenderer.on(
  "worker:createThumbnail",
  (_event: IpcRendererEvent, desc: ThumbnailCreationDesc) => {
    createThumbnail(desc).then((outPath) => {
      ipcRenderer.send("worker:createThumbnailReply", outPath);
    });
  }
);
