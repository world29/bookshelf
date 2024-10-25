import { IpcRendererEvent } from "electron";
import { ThumbnailCreationDesc } from "../models/worker";

declare function doThing(): Promise<string>;

declare function sendThumbnailCreationReply(filePath: string): void;

declare function ThumbnailCreationRequestCallback(
  _event: IpcRendererEvent,
  desc: ThumbnailCreationDesc
): void;

declare function handleThumbnailCreationRequest(
  callback: ThumbnailCreationRequestCallback
): void;
