import { app } from "electron";
import { join } from "path";
import fs from "fs";

export class Store<T extends object> {
  private path: string;
  private data: T;

  constructor(options: { defaults: T }) {
    const userDataPath = app.getPath("userData");

    this.path = join(userDataPath, "config.json");

    this.data = this.parseDataFile(this.path, options.defaults);
  }

  public get(key: keyof T) {
    return this.data[key];
  }

  public set<U extends T[keyof T]>(key: keyof T, val: U) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2));
  }

  public get store(): T {
    return this.data;
  }

  parseDataFile(filePath: string, defaults: T): T {
    try {
      const data = JSON.parse(
        fs.readFileSync(filePath, { encoding: "utf-8" })
      ) as T;

      // ファイルに記述されていないプロパティをデフォルト値で初期化する
      for (const [key, value] of Object.entries(defaults)) {
        if (!Object.prototype.hasOwnProperty.call(data, key)) {
          Object.defineProperty(data, key, {
            value: value,
            writable: true,
            enumerable: true,
            configurable: true,
          });
        }
      }
      return data;
    } catch (error) {
      return defaults;
    }
  }
}
