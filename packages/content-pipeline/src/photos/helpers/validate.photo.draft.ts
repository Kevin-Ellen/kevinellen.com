// packages/content-pipeline/src/photos/helpers/validate.photo.draft.ts

import fs from "node:fs/promises";
import path from "node:path";

import type { PhotoDraftEntry } from "@shared-types/photos/photo.draft.types";

type LoadedPhotoDraft = {
  filePath: string;
  fileName: string;
  photo: PhotoDraftEntry;
};

type ValidatePhotoDraftsInput = {
  draftFolderPath: string;
  drafts: LoadedPhotoDraft[];
};

type ValidatedPhotoDraft = LoadedPhotoDraft;

type ValidatePhotoDraftsResult = {
  validated: ValidatedPhotoDraft[];
};

const assertNonEmptyString = (
  value: string,
  field: string,
  fileName: string,
): void => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Validation failed in "${fileName}": "${field}" must be a non-empty string`,
    );
  }
};

const assertSlugMatchesFileName = (slug: string, fileName: string): void => {
  const expected = fileName.replace(".photo.ts", "");

  if (slug !== expected) {
    throw new Error(
      `Validation failed in "${fileName}": slug "${slug}" does not match file name "${expected}"`,
    );
  }
};

const assertImageExists = async (
  draftFolderPath: string,
  sourceFileName: string,
  fileName: string,
): Promise<void> => {
  const imagePath = path.join(draftFolderPath, "images", sourceFileName);

  try {
    await fs.access(imagePath);
  } catch (error: unknown) {
    throw new Error(
      `Validation failed in "${fileName}": image file not found "${sourceFileName}"`,
      { cause: error },
    );
  }
};

export const validatePhotoDrafts = async (
  input: ValidatePhotoDraftsInput,
): Promise<ValidatePhotoDraftsResult> => {
  const { draftFolderPath, drafts } = input;

  const seenSlugs = new Set<string>();

  for (const draft of drafts) {
    const { fileName, photo } = draft;

    // --- required editorial fields ---
    assertNonEmptyString(photo.title, "title", fileName);
    assertNonEmptyString(photo.alt, "alt", fileName);
    assertNonEmptyString(photo.commentary, "commentary", fileName);
    assertNonEmptyString(photo.readableLocation, "readableLocation", fileName);

    // --- slug consistency ---
    assertSlugMatchesFileName(photo.slug, fileName);

    // --- duplicate slug detection ---
    if (seenSlugs.has(photo.slug)) {
      throw new Error(
        `Duplicate slug detected: "${photo.slug}" (file "${fileName}")`,
      );
    }

    seenSlugs.add(photo.slug);

    // --- image existence ---
    await assertImageExists(draftFolderPath, photo.sourceFileName, fileName);
  }

  return {
    validated: drafts,
  };
};
