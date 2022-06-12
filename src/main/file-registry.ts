import fs from "fs";
import crypt from "crypto";
import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import sqlite3 from "sqlite3";
import { join } from "path";

import { FileInfo, IFileRegistry } from "../lib/file";

ipcMain.handle("remove-file", (_event: IpcMainInvokeEvent, filePath: string) =>
  fileRegistry.removeFile(filePath)
);

ipcMain.handle("get-files", () => fileRegistry.getFiles());

interface FileTableRow {
  file_path: string;
  file_size: number;
  file_hash: string;
}

// レンダラープロセスにファイル登録のメッセージを送る
const sendFileAdded = (fileInfo: FileInfo) => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.webContents.send("file-added", fileInfo);
  }
};

class FileRegistry implements IFileRegistry {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(this.databasePath);
  }

  get databasePath() {
    return join(app.getPath("userData"), "files.db");
  }

  initialize() {
    this.db.run(
      "CREATE TABLE IF NOT EXISTS MEMBERS(file_path, file_size, file_hash)"
    );
  }

  finalize() {
    this.db.close();
  }

  requestAddFiles(filePaths: string[]) {
    filePaths.forEach((filePath) =>
      this.loadFile(filePath).then((fileInfo) => {
        this.addFile(fileInfo);
      })
    );
  }

  addFile(fileInfo: FileInfo) {
    this.db.run(
      "INSERT INTO MEMBERS(file_path, file_size, file_hash) values(?, ?, ?)",
      fileInfo.filePath,
      fileInfo.fileSize,
      fileInfo.fileHash,
      () => sendFileAdded(fileInfo)
    );
  }

  removeFile(filePath: string) {
    return new Promise<void>((resolve) => {
      this.db.run("DELETE FROM MEMBERS WHERE file_path = ?", filePath, () =>
        resolve()
      );
    });
  }

  getFiles() {
    return new Promise<FileInfo[]>((resolve, reject) => {
      this.db.all(
        "SELECT * FROM MEMBERS",
        (err: Error, rows: FileTableRow[]) => {
          if (err) reject(err);

          const fileInfos = rows.map<FileInfo>((row) => ({
            filePath: row.file_path,
            fileSize: row.file_size,
            fileHash: row.file_hash,
          }));

          resolve(fileInfos);
        }
      );
    });
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

fileRegistry.initialize();

export default fileRegistry;
