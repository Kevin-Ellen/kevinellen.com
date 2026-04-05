// packages/content-pipeline/src/photos/helpers/get.latest.photo.draft.folder.ts

import fs from "node:fs/promises";
import path from "node:path";

const PHOTO_DRAFTS_ROOT = path.resolve(
  process.cwd(),
  "content-pipeline",
  "photos",
  "drafts",
);

export const getLatestPhotoDraftFolder = async (): Promise<string> => {
  const entries = await fs.readdir(PHOTO_DRAFTS_ROOT, { withFileTypes: true });

  const folders = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => b.localeCompare(a));

  const latestFolderName = folders[0];

  if (!latestFolderName) {
    throw new Error("No photo draft folders found.");
  }

  return path.join(PHOTO_DRAFTS_ROOT, latestFolderName);
};
