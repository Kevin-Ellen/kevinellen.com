// packages/content-pipeline/src/journal/helpers/read.journal.edit.helper.ts

import path from "node:path";

import type { JournalKvRecord } from "@content-pipeline/journal/types/journal.kv.record.types";

const JOURNAL_EDIT_EXPORT_NAME = "journal";

export const readJournalEdit = async (
  filePath: string,
): Promise<JournalKvRecord> => {
  const modulePath = path.resolve(filePath);
  const importedModule = await import(`${modulePath}?t=${Date.now()}`);

  const journal = importedModule[JOURNAL_EDIT_EXPORT_NAME];

  if (!journal) {
    throw new Error(
      `Missing "${JOURNAL_EDIT_EXPORT_NAME}" export in: ${filePath}`,
    );
  }

  return journal as JournalKvRecord;
};
