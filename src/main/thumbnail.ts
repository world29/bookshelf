import { app } from "electron";
import { join, extname, basename } from "path";
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
  fileName: string
): Promise<string> {
  // webp に変換して出力する
  const uid = uuidv4();
  const outDir = join(thumbnailsDir, uid);
  const outFile = basename(fileName, extname(fileName));
  const outPath = join(outDir, outFile) + ".webp";

  await mkdir(outDir, { recursive: true });

  const outInfo = await sharp(origFile).webp().resize(256).toFile(outPath);

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

  return await writeThumbnail(inBuffer, imageEntryName);
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

  return await writeThumbnail(imageFilePath, imageFilePath);
};

export function createThumbnailFromFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (extname(filePath) === ".zip") {
      createThumbnailFromZip(filePath).then((outPath) => resolve(outPath));
    } else if (statSync(filePath).isDirectory()) {
      createThumbnailFromFolder(filePath).then((outPath) => resolve(outPath));
    } else {
      reject(`unsupported file format: ${filePath}`);
    }
  });
}
