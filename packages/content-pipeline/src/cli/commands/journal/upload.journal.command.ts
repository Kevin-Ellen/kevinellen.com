// packages/content-pipeline/src/cli/commands/journal/upload.journal.command.ts

import path from "node:path";

import type { ContentCommandResult } from "@content-pipeline/cli/types/command.definition.types";
import type { ContentCommandOptions } from "@content-pipeline/cli/types/command.options.types";

import { loadContentPipelineConfig } from "@content-pipeline/config/load.content.pipeline.env";
import { moveDraftWorkspaceToUploaded } from "@content-pipeline/drafts/helpers/move.draft.workspace.to.uploaded.helper";
import { resolveDraftWorkspaceById } from "@content-pipeline/drafts/helpers/resolve.draft.workspace.by.id.helper";
import { resolveLatestDraftWorkspace } from "@content-pipeline/drafts/helpers/resolve.latest.draft.workspace.helper";
import { createJournalKvRecord } from "@content-pipeline/journal/helpers/create.journal.kv.record.helper";
import { readJournalDraft } from "@content-pipeline/journal/helpers/read.journal.draft.helper";
import { putCloudflareKvJson } from "@content-pipeline/media/helpers/put.cloudflare.kv.json.helper";
import { uploadPhotoDraftFiles } from "@content-pipeline/photos/helpers/upload.photo.draft.files.helper";

const JOURNAL_DRAFT_FILE_NAME = "journal.draft.ts";

const getJournalKvKey = (journalId: string): string => {
  return `journal:${journalId}`;
};

const resolveJournalWorkspace = async (options: ContentCommandOptions) => {
  if (options.draftId) {
    return resolveDraftWorkspaceById("journal", options.draftId);
  }

  return resolveLatestDraftWorkspace("journal");
};

export const runUploadJournalCommand = async (
  options: ContentCommandOptions,
): Promise<ContentCommandResult> => {
  const config = loadContentPipelineConfig(options.env);
  const workspace = await resolveJournalWorkspace(options);

  const uploadedPhotoDraftFiles = await uploadPhotoDraftFiles({
    env: options.env,
    workspace,
  });

  const draftFilePath = path.join(workspace.draftPath, JOURNAL_DRAFT_FILE_NAME);

  const journalDraft = await readJournalDraft(draftFilePath);
  const journalKvRecord = createJournalKvRecord(journalDraft);
  const kvKey = getJournalKvKey(journalKvRecord.core.id);

  await putCloudflareKvJson({
    accountId: config.cloudflareAccountId,
    apiToken: config.cloudflareKvApiToken,
    namespaceId: config.cloudflareKvJournalsNamespaceId,
    key: kvKey,
    value: journalKvRecord,
  });

  const uploadedWorkspacePath = await moveDraftWorkspaceToUploaded(workspace);

  console.log("Journal uploaded");
  console.log(`- draft: ${workspace.draftId}`);
  console.log(`- journal id: ${journalKvRecord.core.id}`);
  console.log(`- kv key: ${kvKey}`);
  console.log(`- photo drafts uploaded: ${uploadedPhotoDraftFiles.length}`);
  console.log(`- moved to: ${uploadedWorkspacePath}\n`);

  return {
    workspace,
  };
};
