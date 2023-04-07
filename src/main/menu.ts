import { app, BrowserWindow, Menu, MenuItemConstructorOptions } from "electron";

export function createMenu(mainWindow: BrowserWindow) {
  const template: MenuItemConstructorOptions[] = [
    {
      label: "File",
      submenu: [
        {
          label: "Settings",
          click: () => mainWindow.webContents.send("open-settings"),
        },
        {
          type: "separator",
        },
        {
          label: "Exit",
          click: () => app.quit(),
        },
      ],
    },
    { role: "editMenu" },
    { role: "viewMenu" },
    { role: "windowMenu" },
    { role: "help", submenu: [{ role: "about" }] },
  ];

  // macOS では "アプリメニュー" が必要
  if (process.platform === "darwin") template.unshift({ role: "appMenu" });

  return Menu.buildFromTemplate(template);
}
