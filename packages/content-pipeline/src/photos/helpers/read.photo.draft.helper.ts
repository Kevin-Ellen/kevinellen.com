// packages/content-pipeline/src/photos/helpers/read.photo.draft.helper.ts

import path from "node:path";
import { pathToFileURL } from "node:url";

import type { PhotoDraftEntry } from "@content-pipeline/photos/types/photo.draft.entry.types";

export const readPhotoDraft = async (
  draftFilePath: string,
): Promise<PhotoDraftEntry> => {
  const moduleUrl = pathToFileURL(path.resolve(draftFilePath)).href;
  const importedModule = (await import(moduleUrl)) as {
    photo?: PhotoDraftEntry;
  };

  if (!importedModule.photo) {
    throw new Error(`Draft file does not export "photo": ${draftFilePath}`);
  }

  return importedModule.photo;
};
