import { dialog, Menu, MenuItem } from "electron";
import { IContext } from "./context";

/**
 * [File > Open] メニューのハンドラ
 */
const handleFileOpen = (context: IContext): void => {
  dialog
    .showOpenDialog(context.appWindow, {
      title: "select file to open",
      properties: ["openFile"],
    })
    .then(({ canceled, filePaths }) => {
      if (canceled) {
        return;
      }

      context.bookRepository.requestAddFiles(filePaths);
    })
    .catch((err) => console.error(err));
};

/**
 * アプリケーションメニューの初期化
 */
export function setupMenu(context: IContext): void {
  const fileMenu = new MenuItem({
    role: "fileMenu",
    submenu: [
      {
        label: "Open",
        click: () => {
          handleFileOpen(context);
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
