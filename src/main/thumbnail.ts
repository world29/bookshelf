import { app } from "electron";
import { join, extname, basename } from "path";
import AdmZip from "adm-zip";
import { v4 as uuidv4 } from "uuid";

const thumbnailsDir = join(app.getPath("userData"), "thumbnails");

// サムネイル画像を生成する
const createThumbnailFromZip = (filePath: string) => {
  const zip = new AdmZip(filePath);

  const entries = zip.getEntries();

  if (entries.length === 0) {
    throw new Error(`empty zip: ${filePath}`);
  }

  const firstEntryName = entries[0].entryName;

  // img タグで表示できる画像ファイルをサムネイルとして抜き出す。
  const extensionsRenderableImgTag = [".png", ".jpg", ".jpeg", ".gif"];

  if (!extensionsRenderableImgTag.includes(extname(firstEntryName))) {
    throw new Error(`unsupported file format: ${firstEntryName}`);
  }

  const uid = uuidv4();
  const outDir = join(thumbnailsDir, uid);

  if (!zip.extractEntryTo(firstEntryName, outDir, false, true)) {
    throw new Error(`failed to extract file: ${filePath}`);
  }

  return join(outDir, basename(firstEntryName));
};

export function createThumbnailFromFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (extname(filePath) !== ".zip") {
      reject(`unsupported file format: ${filePath}`);
    }

    resolve(createThumbnailFromZip(filePath));
  });
}
