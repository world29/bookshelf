import { ipcMain, IpcMainInvokeEvent } from "electron";

const setupAPIs = () => {
  ipcMain.handle("do-a-thing", (_event: IpcMainInvokeEvent) =>
    Promise.resolve("hello from main process.")
  );
};

export default setupAPIs;
