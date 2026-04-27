// packages/content-pipeline/src/media/helpers/get.draft.image.files.helper.ts

import fs from "node:fs/promises";
import path from "node:path";

import type { DraftWorkspace } from "@content-pipeline/drafts/types/draft.workspace.types";

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".tif",
  ".tiff",
]);

export const getDraftImageFiles = async (
  workspace: DraftWorkspace,
): Promise<string[]> => {
  const entries = await fs.readdir(workspace.imagesPath, {
    withFileTypes: true,
  });

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) =>
      IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase()),
    )
    .sort()
    .map((fileName) => path.join(workspace.imagesPath, fileName));
};
