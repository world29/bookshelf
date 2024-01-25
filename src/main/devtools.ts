import { session } from "electron";

import fs from "fs-extra";
import path from "path";

const EXTENSIONS_ROOT = "Google/Chrome/User Data/Default/Extensions";

const REACT_DEV_TOOLS = "fmkadmapgofadopljbjfkapdkoienihi";
const REDUX_DEV_TOOLS = "lmhkpmbekcpmknklioeibfkpmmfibljd";

async function loadExtension(devToolsKey: string): Promise<Electron.Extension> {
  return new Promise((resolve, reject) => {
    if (
      process.platform === "win32" &&
      process.env.LOCALAPPDATA !== undefined
    ) {
      const reactDevTools = path.resolve(
        process.env.LOCALAPPDATA,
        EXTENSIONS_ROOT,
        devToolsKey
      );

      // インストールされているバージョンをロードする
      fs.readdir(reactDevTools, (err, versions) => {
        if (err) reject(err);

        session.defaultSession
          .loadExtension(path.resolve(reactDevTools, versions[0]), {
            allowFileAccess: true,
          })
          .then((extension) => resolve(extension));
      });
    }
  });
}

export function loadExtensions(): Promise<Electron.Extension[]> {
  return Promise.all([
    loadExtension(REACT_DEV_TOOLS),
    loadExtension(REDUX_DEV_TOOLS),
  ]);
}
