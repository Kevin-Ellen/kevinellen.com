// packages/content-pipeline/src/journal/helpers/list.journal.edit.workspace.ids.helper.ts

import fs from "node:fs/promises";

import { getContentEditsDirectory } from "@content-pipeline/content/helpers/get.content.edits.directory.helper";

export const listJournalEditWorkspaceIds = async (): Promise<string[]> => {
  const editsDirectory = getContentEditsDirectory("journal");

  try {
    const entries = await fs.readdir(editsDirectory, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort((left, right) => right.localeCompare(left));
  } catch {
    return [];
  }
};
