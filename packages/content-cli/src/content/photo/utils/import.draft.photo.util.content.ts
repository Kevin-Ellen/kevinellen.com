import path from "node:path";
import { pathToFileURL } from "node:url";

import type { AuthoredPhotoMetadata } from "@shared-types/media/photo/authored.photo.types";

type PhotoDraftModule = Readonly<{
  photo: AuthoredPhotoMetadata;
}>;

export const importPhotoDraft = async (
  filePath: string,
): Promise<AuthoredPhotoMetadata> => {
  const modulePath = `${pathToFileURL(path.resolve(filePath)).href}?t=${Date.now()}`;

  const module = (await import(modulePath)) as PhotoDraftModule;

  return module.photo;
};
