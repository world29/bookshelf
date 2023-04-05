import { app } from "electron";
import { join, extname, basename } from "path";
import { mkdir } from "node:fs/promises";
import AdmZip from "adm-zip";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

const thumbnailsDir = join(app.getPath("userData"), "thumbnails");

// サムネイル画像を生成する
const createThumbnailFromZip = async (filePath: string) => {
  const zip = new AdmZip(filePath);

  const entries = zip.getEntries();

  if (entries.length === 0) {
    throw new Error(`empty zip: ${filePath}`);
  }

  // img タグで表示できる最初の画像ファイルをサムネイルとして抜き出す。
  const extensionsRenderableImgTag = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

  let imageEntryName = "";

  for (const entry of entries) {
    if (extensionsRenderableImgTag.includes(extname(entry.entryName))) {
      imageEntryName = entry.entryName;
      break;
    }
  }

  if (imageEntryName === "") {
    throw new Error(`supported image not found: ${filePath}`);
  }

  // webp に変換して出力する
  const uid = uuidv4();
  const outDir = join(thumbnailsDir, uid);
  const outFile = basename(imageEntryName, extname(imageEntryName));
  const outPath = join(outDir, outFile) + ".webp";

  await mkdir(outDir, { recursive: true });

  const inBuffer = zip.readFile(imageEntryName);

  if (!inBuffer) {
    throw new Error(`failed to AdmZip.readFile(${imageEntryName}`);
  }

  await sharp(inBuffer).webp().toFile(outPath);

  return outPath;
};

export function createThumbnailFromFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (extname(filePath) !== ".zip") {
      reject(`unsupported file format: ${filePath}`);
    }

    createThumbnailFromZip(filePath).then((outPath) => resolve(outPath));
  });
}
