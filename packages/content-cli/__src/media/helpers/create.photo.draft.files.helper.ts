// packages/content-pipeline/src/media/helpers/create.photo.draft.files.helper.ts

import fs from "node:fs/promises";
import path from "node:path";

import { resolveImageMetadata } from "@content-pipeline/media/helpers/resolve.image.metadata.helper";
import { createPhotoDraftEntry } from "@content-pipeline/photos/helpers/create.photo.draft.entry.helper";
import { renderPhotoDraftFile } from "@content-pipeline/photos/helpers/render.photo.draft.file";

import type { PhotoDraftEntry } from "@content-pipeline/photos/types/photo.draft.entry.types";

export type CreatedPhotoDraftFile = {
  imageFilePath: string;
  draftFileName: string;
  outputFilePath: string;
  entry: PhotoDraftEntry;
};

const getDraftFileNameFromImage = (imageFilePath: string): string => {
  const baseName = path.parse(imageFilePath).name;

  return `${baseName}.draft.ts`;
};

export const createPhotoDraftFiles = async (
  draftPath: string,
  imageFilePaths: string[],
): Promise<CreatedPhotoDraftFile[]> => {
  const createdDraftFiles: CreatedPhotoDraftFile[] = [];

  for (const imageFilePath of imageFilePaths) {
    const resolvedImageMetadata = await resolveImageMetadata(imageFilePath);
    const photoDraftEntry = createPhotoDraftEntry(resolvedImageMetadata);
    const photoDraftFileContent = renderPhotoDraftFile(photoDraftEntry);

    const draftFileName = getDraftFileNameFromImage(imageFilePath);
    const outputFilePath = path.join(draftPath, draftFileName);

    await fs.writeFile(outputFilePath, photoDraftFileContent, "utf8");

    createdDraftFiles.push({
      imageFilePath,
      draftFileName,
      outputFilePath,
      entry: photoDraftEntry,
    });
  }

  return createdDraftFiles;
};
