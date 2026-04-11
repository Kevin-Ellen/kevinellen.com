// packages/content-pipeline/src/photos/helpers/resolve.photo.source.image.path.helper.ts

import path from "node:path";
import fs from "node:fs/promises";

import type { DraftWorkspace } from "@content-pipeline/drafts/types/draft.workspace.types";
import type { PhotoDraftEntry } from "@content-pipeline/photos/types/photo.draft.entry.types";

export const resolvePhotoSourceImagePath = async (
  workspace: DraftWorkspace,
  photoDraft: PhotoDraftEntry,
): Promise<string> => {
  const imageFilePath = path.join(
    workspace.imagesPath,
    photoDraft.sourceFileName,
  );

  await fs.access(imageFilePath);

  return imageFilePath;
};
