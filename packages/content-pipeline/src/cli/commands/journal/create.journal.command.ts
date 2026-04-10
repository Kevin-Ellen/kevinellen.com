// packages/content-pipeline/src/cli/commands/journal/create.journal.command.ts

import fs from "node:fs/promises";
import path from "node:path";

import type { ContentCommandOptions } from "@content-pipeline/cli/command.options.types";

const DRAFTS_ROOT = path.resolve(
  process.cwd(),
  "content-pipeline",
  "journal",
  "drafts",
);

const formatTimestamp = (date: Date): string => {
  return date
    .toISOString()
    .replace(/:/g, "-")
    .replace(/\.\d{3}Z$/, "");
};

export const runCreateJournalCommand = async (
  _options: ContentCommandOptions,
): Promise<void> => {
  const timestamp = formatTimestamp(new Date());

  const draftPath = path.join(DRAFTS_ROOT, timestamp);
  const imagesPath = path.join(draftPath, "images");

  try {
    await fs.access(draftPath);
    throw new Error(`Draft folder already exists: ${draftPath}`);
  } catch {
    // expected when folder does not exist
  }

  await fs.mkdir(imagesPath, { recursive: true });

  console.log("\nJournal draft created");
  console.log(`→ ${draftPath}`);
  console.log("\nNext steps:");
  console.log("1. Add images to the images/ folder if needed");
  console.log("2. Run: content journal start");
  console.log("3. Open the folder in your editor");
  console.log(`   code ${draftPath}\n`);
};
