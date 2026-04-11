// packages/content-pipeline/src/journal/helpers/create.journal.photo.ids.helper.ts

import path from "node:path";

const toPhotoId = (sourceFileName: string): string => {
  return sourceFileName
    .toLowerCase()
    .trim()
    .replace(/\.[^.]+$/, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const createJournalPhotoIds = (imageFilePaths: string[]): string[] => {
  return imageFilePaths.map((imageFilePath) => {
    const fileName = path.basename(imageFilePath);

    return toPhotoId(fileName);
  });
};
