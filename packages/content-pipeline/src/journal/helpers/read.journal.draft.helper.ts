// packages/content-pipeline/src/journal/helpers/read.journal.draft.helper.ts

import path from "node:path";
import { pathToFileURL } from "node:url";

import type { JournalDraft } from "@content-pipeline/journal/types/journal.draft.entry.types";

export const readJournalDraft = async (
  draftFilePath: string,
): Promise<JournalDraft> => {
  const moduleUrl = pathToFileURL(path.resolve(draftFilePath)).href;
  const importedModule = (await import(moduleUrl)) as {
    journal?: JournalDraft;
  };

  if (!importedModule.journal) {
    throw new Error(`Draft file does not export "journal": ${draftFilePath}`);
  }

  return importedModule.journal;
};
