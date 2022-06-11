import fs from "fs";
import crypt from "crypto";
import { BrowserWindow } from "electron";

import { FileInfo, IFileRegistry } from "../lib/file";

// レンダラープロセスにファイル登録のメッセージを送る
const sendFileAdded = (fileInfo: FileInfo) => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.webContents.send("file-added", fileInfo);
  }
};

export class FileRegistry implements IFileRegistry {
  requestAddFiles(filePaths: string[]) {
    filePaths.forEach((filePath) =>
      this.loadFile(filePath).then((fileInfo) => sendFileAdded(fileInfo))
    );
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
