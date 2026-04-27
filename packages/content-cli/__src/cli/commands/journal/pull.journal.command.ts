// packages/content-pipeline/src/cli/commands/journal/pull.journal.command.ts

import fs from "node:fs/promises";
import path from "node:path";

import { cancel, isCancel, text } from "@clack/prompts";

import type { ContentCommandResult } from "@content-pipeline/cli/types/command.definition.types";
import type { ContentCommandOptions } from "@content-pipeline/cli/types/command.options.types";

import { getContentEditWorkspaceDirectory } from "@content-pipeline/content/helpers/get.content.edit.workspace.directory.helper";
import { getJournalKvRecordById } from "@content-pipeline/journal/helpers/get.journal.kv.record.by.id.helper";
import { renderJournalEditDraftFile } from "@content-pipeline/journal/helpers/render.journal.edit.draft.file.helper";

const JOURNAL_EDIT_FILE_NAME = "journal.edit.ts";

export const runPullJournalCommand = async (
  options: ContentCommandOptions,
): Promise<ContentCommandResult> => {
  const enteredId = await text({
    message: "Journal id to pull",
    placeholder: "looks-can-be-deceiving",
  });

  if (isCancel(enteredId)) {
    cancel("Cancelled");
    return {};
  }

  const id = enteredId.trim();

  if (id.length === 0) {
    throw new Error("Journal id is required.");
  }

  const journalRecord = await getJournalKvRecordById(options.env, id);
  const workspacePath = getContentEditWorkspaceDirectory("journal", id);
  const outputFilePath = path.join(workspacePath, JOURNAL_EDIT_FILE_NAME);

  await fs.mkdir(workspacePath, { recursive: true });
  await fs.writeFile(
    outputFilePath,
    renderJournalEditDraftFile(journalRecord),
    "utf8",
  );

  console.log("\nJournal pulled for editing");
  console.log(`- id: ${id}`);
  console.log(`- path: ${workspacePath}`);
  console.log(`- file: ${outputFilePath}\n`);

  return {};
};
