import { app } from "electron";
import { join } from "path";
import fs from "fs";

export class Store<T> {
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
      return JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" })) as T;
    } catch (error) {
      return defaults;
    }
  }
}
