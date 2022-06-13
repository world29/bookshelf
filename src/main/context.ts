import { BrowserWindow } from "electron";

import { IBookRepository } from "../lib/book";

export interface IContext {
  get bookRepository(): IBookRepository;
  get appWindow(): BrowserWindow;
}
