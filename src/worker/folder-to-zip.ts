import { readdir } from "node:fs/promises";
import { join } from "path";
import AdmZip from "adm-zip";

import { FolderToZipConversionDesc } from "../models/worker";

type FileEntry = {
  path: string;
  is_directory: boolean;
};

async function readdirRecursive(dir_path: string): Promise<FileEntry[]> {
  const entries: FileEntry[] = [];

  const dirents = await readdir(dir_path, {
    withFileTypes: true,
  });

  for (const entry of dirents) {
    const path = join(dir_path, entry.name);
    if (entry.isDirectory()) {
      entries.push({ path: path + "/", is_directory: true });
      entries.push(...(await readdirRecursive(path)));
    } else {
      entries.push({ path, is_directory: false });
    }
  }

  return entries;
}

export default async function convertFolderToZip(
  desc: FolderToZipConversionDesc
): Promise<string> {
  console.log(`convertFolderToZip: ${desc.folder_path} -> ${desc.zip_path}`);

  const entries = await readdirRecursive(desc.folder_path);

  for (const entry of entries) {
    if (entry.is_directory) {
      console.log(`dir: ${entry.path}`);
    } else {
      console.log(`file: ${entry.path}`);
    }
  }

  const zip = new AdmZip();

  await zip.addLocalFolderPromise(desc.folder_path, {});

  const ok = await zip.writeZipPromise(desc.zip_path);
  if (!ok) {
    return Promise.reject(`failed to AdmZip.writeZip. ${desc.zip_path}`);
  }

  console.log(`convertFolderToZip:end`);

  return desc.zip_path;
}
