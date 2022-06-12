import fs from "fs";
import crypt from "crypto";
import { BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";

import { FileInfo, IFileRegistry } from "../lib/file";

ipcMain.handle("remove-file", (_event: IpcMainInvokeEvent, filePath: string) =>
  Promise.resolve(fileRegistry.removeFile(filePath))
);

ipcMain.handle("get-files", () => Promise.resolve(fileRegistry.getFiles()));

// レンダラープロセスにファイル登録のメッセージを送る
const sendFileAdded = (fileInfo: FileInfo) => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.webContents.send("file-added", fileInfo);
  }
};

class FileRegistry implements IFileRegistry {
  private fileInfos: FileInfo[];

  constructor() {
    this.fileInfos = [
      { filePath: "hoge/fuga", fileSize: 200, fileHash: "hashshahshhash" },
    ];
  }

  requestAddFiles(filePaths: string[]) {
    filePaths.forEach((filePath) =>
      this.loadFile(filePath).then((fileInfo) => {
        this.fileInfos.push(fileInfo);
        sendFileAdded(fileInfo);
      })
    );
  }

  removeFile(filePath: string) {
    this.fileInfos = this.fileInfos.filter(
      (info) => info.filePath !== filePath
    );
  }

  getFiles() {
    return this.fileInfos;
  }

  loadFile(filePath: string): Promise<FileInfo> {
    return new Promise((resolve) => {
      const stat = fs.statSync(filePath);

      // compute md5 hash
      const md5 = crypt.createHash("md5");
      const fileContent = fs.readFileSync(filePath);
      const hash = md5.update(fileContent).digest("hex");

      const fileInfo: FileInfo = {
        filePath,
        fileSize: stat.size,
        fileHash: hash,
      };

      resolve(fileInfo);
    });
  }
}

const fileRegistry = new FileRegistry();
export default fileRegistry;
