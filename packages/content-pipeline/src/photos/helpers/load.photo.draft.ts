// packages/content-pipeline/src/photos/helpers/load.photo.draft.ts

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import type { PhotoDraftEntry } from "@shared-types/photos/photo.draft.types";

import { getLatestPhotoDraftFolder } from "./get.latest.photo.draft.folder";

type LoadedPhotoDraft = {
  filePath: string;
  fileName: string;
  photo: PhotoDraftEntry;
};

type LoadPhotoDraftResult = {
  draftFolderPath: string;
  drafts: LoadedPhotoDraft[];
};

const isPhotoDraftEntry = (value: unknown): value is PhotoDraftEntry => {
  if (!value || typeof value !== "object") return false;

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.slug === "string" &&
    typeof obj.sourceFileName === "string" &&
    typeof obj.title === "string" &&
    typeof obj.alt === "string" &&
    typeof obj.commentary === "string" &&
    typeof obj.readableLocation === "string"
  );
};

export const loadPhotoDrafts = async (): Promise<LoadPhotoDraftResult> => {
  const draftFolderPath = await getLatestPhotoDraftFolder();

  const entries = await fs.readdir(draftFolderPath, {
    withFileTypes: true,
  });

  const draftFiles = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => fileName.endsWith(".photo.ts"))
    .sort((a, b) => a.localeCompare(b));

  if (draftFiles.length === 0) {
    throw new Error(
      `No .photo.ts files found in draft folder: ${draftFolderPath}`,
    );
  }

  const drafts: LoadedPhotoDraft[] = [];

  for (const fileName of draftFiles) {
    const filePath = path.join(draftFolderPath, fileName);

    const moduleUrl = pathToFileURL(filePath).href;

    let mod: unknown;

    try {
      mod = await import(moduleUrl);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown import error";

      throw new Error(`Failed to import draft file "${fileName}": ${message}`, {
        cause: error,
      });
    }

    const photo = (mod as Record<string, unknown>).photo;

    if (!isPhotoDraftEntry(photo)) {
      throw new Error(
        `Invalid draft shape in "${fileName}" — missing required fields`,
      );
    }

    drafts.push({
      filePath,
      fileName,
      photo,
    });
  }

  return {
    draftFolderPath,
    drafts,
  };
};
