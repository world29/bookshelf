import { app } from "electron";
import { join, extname } from "path";
import { mkdir, readdir } from "node:fs/promises";
import { statSync } from "fs";
import AdmZip from "adm-zip";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

const thumbnailsDir = join(app.getPath("userData"), "thumbnails");

function isImageFile(fileName: string): boolean {
  const extensionsRenderableImgTag = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

  return extensionsRenderableImgTag.includes(extname(fileName));
}

async function writeThumbnail(
  origFile: string | Buffer,
  size: number
): Promise<string> {
  // webp に変換して出力する
  const uid = uuidv4();
  const outDir = join(thumbnailsDir, uid);
  const outPath = join(outDir, `${size}.webp`);

  await mkdir(outDir, { recursive: true });

  const outInfo = await sharp(origFile).webp().resize(size).toFile(outPath);

  console.dir(outInfo);

  return outPath;
}

// サムネイル画像を生成する
const createThumbnailFromZip = async (filePath: string) => {
  const zip = new AdmZip(filePath);

  const entries = zip.getEntries();

  if (entries.length === 0) {
    throw new Error(`empty zip: ${filePath}`);
  }

  let imageEntryName = "";

  for (const entry of entries) {
    if (isImageFile(entry.entryName)) {
      imageEntryName = entry.entryName;
      break;
    }
  }

  if (imageEntryName === "") {
    throw new Error(`supported image not found: ${filePath}`);
  }

  const inBuffer = zip.readFile(imageEntryName);

  if (!inBuffer) {
    throw new Error(`failed to AdmZip.readFile(${imageEntryName}`);
  }

  return await writeThumbnail(inBuffer, 256);
};

async function findFirstImage(dir: string): Promise<string> {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    let foundImage = "";
    if (entry.isFile()) {
      if (isImageFile(entry.name)) {
        foundImage = join(dir, entry.name);
      }
    } else if (entry.isDirectory()) {
      foundImage = await findFirstImage(join(dir, entry.name));
    }

    if (foundImage) {
      return foundImage;
    }
  }

  return "";
}

// フォルダパスからサムネイル画像を生成する
const createThumbnailFromFolder = async (dirPath: string) => {
  const imageFilePath = await findFirstImage(dirPath);
  if (imageFilePath === "") {
    throw new Error(`supported image not found: ${dirPath}`);
  }

  return await writeThumbnail(imageFilePath, 256);
};

export function createThumbnailFromFile(filePath: string): Promise<string> {
  if (extname(filePath) === ".zip") {
    return createThumbnailFromZip(filePath);
  }

  if (statSync(filePath).isDirectory()) {
    return createThumbnailFromFolder(filePath);
  }

  return Promise.reject(`unsupported file format: ${filePath}`);
}
