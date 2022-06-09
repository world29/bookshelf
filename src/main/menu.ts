import { BrowserWindow, dialog, Menu, MenuItem } from "electron";

/**
 * [File > Open] メニューのハンドラ
 *
 * @param {BrowserWindow} appWindow - アプリケーションウィンドウ (ダイアログを開くのに必要)
 */
const handleFileOpen = (appWindow: BrowserWindow): void => {
  dialog
    .showOpenDialog(appWindow, {
      title: "select file to open",
      properties: ["openFile"],
    })
    .then(({ canceled, filePaths }) => {
      if (canceled) {
        return;
      }

      // レンダラープロセスにファイル登録のメッセージを送る
      appWindow.webContents.send("file-added", filePaths);
    })
    .catch((err) => console.error(err));
};

/**
 * アプリケーションメニューの初期化
 *
 * @param {BrowserWindow} appWindow - アプリケーションウィンドウ
 */
export function setupMenu(appWindow: BrowserWindow): void {
  const fileMenu = new MenuItem({
    role: "fileMenu",
    submenu: [
      {
        label: "Open",
        click: () => {
          handleFileOpen(appWindow);
        },
      },
      { type: "separator" },
      { role: "quit" },
    ],
  });

  const menu = new Menu();

  menu.append(fileMenu);

  Menu.setApplicationMenu(menu);
}
