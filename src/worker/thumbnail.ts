import { join, extname } from "path";
import { mkdir, readdir } from "node:fs/promises";
import { statSync } from "fs";
import AdmZip from "adm-zip";
import sharp from "sharp";

import { ThumbnailCreationDesc } from "../models/worker";

function isImageFile(fileName: string): boolean {
  const extensionsRenderableImgTag = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

  return extensionsRenderableImgTag.includes(extname(fileName));
}

async function writeThumbnail(
  origFile: string | Buffer,
  width: number,
  height: number,
  outDir: string
): Promise<string> {
  // webp に変換して出力する
  const outPath = join(outDir, `${width}x${height}.webp`);

  await mkdir(outDir, { recursive: true });

  const outInfo = await sharp(origFile)
    .webp()
    .resize(width, height)
    .toFile(outPath);

  console.dir(outInfo);

  return outPath;
}

// サムネイル画像を生成する
const createThumbnailFromZip = async (desc: ThumbnailCreationDesc) => {
  try {
    const zip = new AdmZip(desc.path);

    const entries = zip.getEntries();

    if (entries.length === 0) {
      throw new Error(`empty zip: ${desc.path}`);
    }

    entries.sort();

    let imageEntryName = "";

    for (const entry of entries) {
      if (isImageFile(entry.entryName)) {
        imageEntryName = entry.entryName;
        break;
      }
    }

    if (imageEntryName === "") {
      throw new Error(`supported image not found: ${desc.path}`);
    }

    console.log(`create thumbnail from ${imageEntryName}`);

    const inBuffer = zip.readFile(imageEntryName);

    if (!inBuffer) {
      throw new Error(`failed to AdmZip.readFile(${imageEntryName}`);
    }

    return await writeThumbnail(
      inBuffer,
      desc.width,
      desc.height,
      desc.out_dir
    );
  } catch (err) {
    return Promise.reject(err);
  }
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
const createThumbnailFromFolder = async (desc: ThumbnailCreationDesc) => {
  const imageFilePath = await findFirstImage(desc.path);
  if (imageFilePath === "") {
    throw new Error(`supported image not found: ${desc.path}`);
  }

  return await writeThumbnail(
    imageFilePath,
    desc.width,
    desc.height,
    desc.out_dir
  );
};

export default async function createThumbnail(desc: ThumbnailCreationDesc) {
  if (extname(desc.path) === ".zip") {
    return createThumbnailFromZip(desc);
  }

  if (statSync(desc.path).isDirectory()) {
    return createThumbnailFromFolder(desc);
  }

  throw new Error(`unsupported file format: ${desc.path}`);
}
