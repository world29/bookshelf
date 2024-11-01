import { FolderToZipConversionDesc } from "../models/worker";

export default async function folderToZip(
  desc: FolderToZipConversionDesc
): Promise<void> {
  console.log(`folderToZip: ${desc.folder_path} -> ${desc.zip_path}`);
}
