import { IpcRendererEvent } from "electron";
import {
  FolderToZipConversionDesc,
  ThumbnailCreationDesc,
} from "../models/worker";

declare function doThing(): Promise<string>;

declare function sendThumbnailCreationReply(filePath: string): void;

declare function FolderToZipConversionRequestCallback(
  _event: IpcRendererEvent,
  desc: FolderToZipConversionDesc
): void;

declare function ThumbnailCreationRequestCallback(
  _event: IpcRendererEvent,
  desc: ThumbnailCreationDesc
): void;

declare function handleFolderToZipConversionRequest(
  callback: FolderToZipConversionRequestCallback
): void;

declare function handleThumbnailCreationRequest(
  callback: ThumbnailCreationRequestCallback
): void;
