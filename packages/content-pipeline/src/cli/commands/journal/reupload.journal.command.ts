// packages/content-pipeline/src/cli/commands/journal/reupload.journal.command.ts

import path from "node:path";

import { cancel, confirm, isCancel, select } from "@clack/prompts";

import type { ContentCommandResult } from "@content-pipeline/cli/types/command.definition.types";
import type { ContentCommandOptions } from "@content-pipeline/cli/types/command.options.types";

import { loadContentPipelineConfig } from "@content-pipeline/config/load.content.pipeline.env";
import { getContentEditWorkspaceDirectory } from "@content-pipeline/content/helpers/get.content.edit.workspace.directory.helper";
import { putCloudflareKvJson } from "@content-pipeline/media/helpers/put.cloudflare.kv.json.helper";
import { listJournalEditWorkspaceIds } from "@content-pipeline/journal/helpers/list.journal.edit.workspace.ids.helper";
import { readJournalEdit } from "@content-pipeline/journal/helpers/read.journal.edit.helper";
import { upsertJournalLastUpdate } from "@content-pipeline/journal/helpers/upsert.journal.last.update.helper";
import { formatLocalDateTimeWithOffset } from "@content-pipeline/utils/format.local.date.time.with.offset.util";

const JOURNAL_EDIT_FILE_NAME = "journal.edit.ts";

const getJournalKvKey = (id: string): string => {
  return `journal:${id}`;
};

export const runReuploadJournalCommand = async (
  options: ContentCommandOptions,
): Promise<ContentCommandResult> => {
  const workspaceIds = await listJournalEditWorkspaceIds();

  if (workspaceIds.length === 0) {
    console.log("\nNo journal edit workspaces found.\n");
    return {};
  }

  const selectedWorkspaceId = await select({
    message: "Choose a journal edit workspace",
    options: workspaceIds.map((workspaceId) => ({
      value: workspaceId,
      label: workspaceId,
    })),
  });

  if (isCancel(selectedWorkspaceId)) {
    cancel("Cancelled");
    return {};
  }

  const workspacePath = getContentEditWorkspaceDirectory(
    "journal",
    selectedWorkspaceId,
  );

  const filePath = path.join(workspacePath, JOURNAL_EDIT_FILE_NAME);
  const journal = await readJournalEdit(filePath);
  const updatedAt = formatLocalDateTimeWithOffset(new Date());
  const updatedJournal = upsertJournalLastUpdate(journal, updatedAt);
  const kvKey = getJournalKvKey(updatedJournal.core.id);

  const proceed = await confirm({
    message: [
      `Re-upload journal: ${updatedJournal.core.id}`,
      "",
      `Published: ${
        updatedJournal.content.footer.publication.find(
          (item) => item.label === "Published",
        )?.value ?? "unknown"
      }`,
      `Updated:   ${updatedAt}`,
    ].join("\n"),
    initialValue: false,
  });

  if (isCancel(proceed) || !proceed) {
    cancel("Cancelled");
    return {};
  }

  const config = loadContentPipelineConfig(options.env);

  await putCloudflareKvJson({
    accountId: config.cloudflareAccountId,
    apiToken: config.cloudflareKvApiToken,
    namespaceId: config.cloudflareKvJournalsNamespaceId,
    key: kvKey,
    value: updatedJournal,
  });

  console.log("\nJournal re-uploaded");
  console.log(`- id: ${updatedJournal.core.id}`);
  console.log(`- kv key: ${kvKey}`);
  console.log(`- file: ${filePath}`);
  console.log(`- last update: ${updatedAt}\n`);

  return {};
};
