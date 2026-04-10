// packages/content-pipeline/src/cli/commands/photo/start.photo.command.ts

import path from "node:path";

import type { ContentCommandOptions } from "@content-pipeline/cli/command.options.types";

import { getLatestPhotoDraftFolder } from "@content-pipeline/photos/helpers/get.latest.photo.draft.folder";
import { generatePhotoDraftsForFolder } from "@content-pipeline/photos/helpers/generate.photo.drafts.for.folder";

export const runStartPhotoCommand = async (
  _options: ContentCommandOptions,
): Promise<void> => {
  const draftFolderPath = await getLatestPhotoDraftFolder();
  const imagesFolderPath = path.join(draftFolderPath, "images");

  const { createdCount, skippedCount } =
    await generatePhotoDraftsForFolder(draftFolderPath);

  if (createdCount === 0 && skippedCount === 0) {
    throw new Error(`No supported image files found in: ${imagesFolderPath}`);
  }

  console.log("\nPhoto draft start complete");
  console.log(`→ Draft folder: ${draftFolderPath}`);
  console.log(`→ Created: ${createdCount}`);
  console.log(`→ Skipped: ${skippedCount}`);

  console.log("\nNext steps:");
  console.log("1. Review the generated .photo.ts files");
  console.log("2. Add title, alt, commentary, and readableLocation");
  console.log("3. Open the draft folder in your editor");
  console.log(`   code ${draftFolderPath}`);
  console.log("4. Run: content photo upload\n");
};
