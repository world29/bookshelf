import { spawn } from "node:child_process";

import settingsStore from "./settings";

export function openFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const viewerPath = settingsStore.get("viewer");

    const subprocess = spawn(viewerPath, [filePath], {
      detached: true,
      stdio: "ignore",
    });

    subprocess
      .on("error", (err) => reject(err))
      .on("spawn", () => {
        subprocess.unref();
        resolve();
      });
  });
}
