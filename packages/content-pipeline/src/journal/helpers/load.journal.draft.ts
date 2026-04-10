// packages/content-pipeline/src/journal/helpers/load.journal.draft.ts

import path from "node:path";

import type { JournalDraft } from "@content-pipeline/journal/types/journal.types";

import { getLatestJournalDraftFolder } from "@content-pipeline/journal/helpers/get.latest.journal.draft.folder";

export const loadJournalDraft = async (): Promise<{
  draftFolderPath: string;
  journal: JournalDraft;
}> => {
  const draftFolderPath = await getLatestJournalDraftFolder();
  const journalFilePath = path.join(draftFolderPath, "entry.journal.ts");

  const imported = await import(journalFilePath);
  const journal = imported.journal as JournalDraft | undefined;

  if (!journal) {
    throw new Error(`No journal export found in: ${journalFilePath}`);
  }

  return {
    draftFolderPath,
    journal,
  };
};
