import { BrowserWindow } from "electron";
import { IFileRegistry } from "../lib/file";

export interface IContext {
  get fileRegistry(): IFileRegistry;
  get appWindow(): BrowserWindow;
}
