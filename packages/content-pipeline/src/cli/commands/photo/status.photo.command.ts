// packages/content-pipeline/src/cli/commands/photo/status.photo.command.ts

import path from "node:path";

import type { ContentCommandOptions } from "@content-pipeline/cli/command.options.types";

import { getLatestPhotoDraftFolder } from "@content-pipeline/photos/helpers/get.latest.photo.draft.folder";
import { scanImagesFolder } from "@content-pipeline/photos/helpers/scan.images.folder";
import { loadPhotoDrafts } from "@content-pipeline/photos/helpers/load.photo.draft";

export const runStatusPhotoCommand = async (
  _options: ContentCommandOptions,
): Promise<void> => {
  let draftFolderPath: string;

  try {
    draftFolderPath = await getLatestPhotoDraftFolder();
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown draft lookup error";

    if (message === "No photo draft folders found.") {
      console.log("\nPhoto draft status");
      console.log("→ No active photo drafts found");
      console.log("\nNext steps:");
      console.log("1. Create a new draft");
      console.log("2. Add images to the draft folder");
      console.log("3. Start the draft pipeline\n");
      return;
    }

    throw error;
  }

  const imagesFolderPath = path.join(draftFolderPath, "images");
  const imageFilePaths = await scanImagesFolder(imagesFolderPath);
  const { drafts } = await loadPhotoDrafts();

  console.log("\nPhoto draft status");
  console.log(`→ Draft folder: ${draftFolderPath}`);

  console.log("\nImages:");
  if (imageFilePaths.length === 0) {
    console.log("✗ No images found");
  } else {
    imageFilePaths.forEach((filePath) => {
      console.log(`✓ ${path.basename(filePath)}`);
    });
  }

  console.log("\nDraft files:");
  if (drafts.length === 0) {
    console.log("✗ No draft files found");
  } else {
    drafts.forEach(({ fileName }) => {
      console.log(`✓ ${fileName}`);
    });
  }

  console.log("\nEditorial:");

  for (const { photo } of drafts) {
    console.log(`\n${photo.slug}`);

    const checks = [
      { label: "title", value: photo.title },
      { label: "alt", value: photo.alt },
      { label: "commentary", value: photo.commentary },
      { label: "readableLocation", value: photo.readableLocation },
    ];

    checks.forEach(({ label, value }) => {
      if (!value || value.trim().length === 0) {
        console.log(`✗ Missing ${label}`);
      } else {
        console.log(`✓ ${label}`);
      }
    });
  }

  console.log("");
};
