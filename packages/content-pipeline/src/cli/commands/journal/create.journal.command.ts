// packages/content-pipeline/src/cli/commands/journal/create.journal.command.ts

import fs from "node:fs/promises";
import path from "node:path";

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

export const runCreateJournalCommand = async (): Promise<void> => {
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

  console.log("\nJournal draft created");
  console.log(`→ ${draftPath}`);
  console.log("\nNext steps:");
  console.log("1. Add images to the images/ folder");
  console.log("2. Run: content journal start\n");
};
