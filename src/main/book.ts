import { Stats } from "node:fs";
import { stat } from "node:fs/promises";
import { basename, extname } from "path";

export type BookFileInfo = {
  path: string;
  title: string;
  stats: Stats;
  modifiedTime: string;
};

export async function getBookFileInfo(path: string): Promise<BookFileInfo> {
  // 拡張子を除外したファイル名をデフォルトのタイトルとする。
  const title = basename(path, extname(path));

  const stats = await stat(path);
  const modifiedTime = stats.mtime.toISOString();

  return { path, title, stats, modifiedTime };
}
