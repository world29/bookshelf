import { readdir } from "node:fs/promises";
import AdmZip from "adm-zip";

import { FolderToZipConversionDesc } from "../models/worker";

export default async function convertFolderToZip(
  desc: FolderToZipConversionDesc
): Promise<string> {
  console.log(`convertFolderToZip: ${desc.folder_path} -> ${desc.zip_path}`);

  //const zip = new AdmZip(desc.zip_path);

  const dirents = await readdir(desc.folder_path, {
    withFileTypes: true,
  });

  for (const entry of dirents) {
    if (entry.isDirectory()) {
      console.log(`dir: ${entry.name}`);
    } else {
      console.log(`file: ${entry.name}`);
    }
  }

  console.log(`convertFolderToZip:end`);

  return desc.zip_path;
}
