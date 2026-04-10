// packages/content-pipeline/src/journal/helpers/get.latest.journal.draft.folder.ts

import fs from "node:fs/promises";
import path from "node:path";

const DRAFTS_ROOT = path.resolve(
  process.cwd(),
  "content-pipeline",
  "journal",
  "drafts",
);

export const getLatestJournalDraftFolder = async (): Promise<string> => {
  let entries: string[];

  try {
    entries = await fs.readdir(DRAFTS_ROOT);
  } catch {
    throw new Error("Journal drafts folder does not exist.");
  }

  if (entries.length === 0) {
    throw new Error("No journal draft folders found.");
  }

  // assumes timestamp folder names → lexical sort works
  const sorted = entries.sort();

  const latest = sorted[sorted.length - 1];

  return path.join(DRAFTS_ROOT, latest);
};
