// packages/content-pipeline/src/journal/helpers/render.journal.edit.draft.file.helper.ts

import type { JournalKvRecord } from "@content-pipeline/journal/types/journal.kv.record.types";

const renderValue = (value: unknown): string => {
  return JSON.stringify(value, null, 2);
};

export const renderJournalEditDraftFile = (
  journal: JournalKvRecord,
): string => {
  return [
    'import type { JournalKvRecord } from "@content-pipeline/journal/types/journal.kv.record.types";',
    "",
    `export const journal: JournalKvRecord = ${renderValue(journal)};`,
    "",
  ].join("\n");
};
