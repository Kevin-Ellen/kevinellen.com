// packages/content-pipeline/src/cli/commands/photo/create.photo.command.ts

import fs from "node:fs/promises";
import path from "node:path";

import type { ContentCommandOptions } from "@content-pipeline/cli/command.options.types";

const DRAFTS_ROOT = path.resolve(
  process.cwd(),
  "content-pipeline",
  "photos",
  "drafts",
);

const formatTimestamp = (date: Date): string => {
  return date
    .toISOString()
    .replace(/:/g, "-")
    .replace(/\.\d{3}Z$/, "");
};

export const runCreatePhotoCommand = async (
  _options: ContentCommandOptions,
): Promise<void> => {
  const timestamp = formatTimestamp(new Date());

  const draftPath = path.join(DRAFTS_ROOT, timestamp);
  const imagesPath = path.join(draftPath, "images");

  // Guard: do not overwrite if somehow exists
  try {
    await fs.access(draftPath);
    throw new Error(`Draft folder already exists: ${draftPath}`);
  } catch {
    // expected when folder does not exist
  }

  await fs.mkdir(imagesPath, { recursive: true });

  console.log("\nPhoto draft created");
  console.log(`→ ${draftPath}`);
  console.log("\nNext steps:");
  console.log("1. Add images to the images/ folder");
  console.log("2. Run: content photo start");
  console.log("3. Open the folder in your editor");
  console.log(`   code ${draftPath}\n`);
};
