// packages/content-pipeline/src/cli/commands/journal/upload.journal.command.ts

import type { ContentCommandOptions } from "@content-pipeline/cli/command.options.types";

import { loadContentPipelineEnv } from "@content-pipeline/cli/config/load.content.pipeline.env";
import { validateContentPipelineEnv } from "@content-pipeline/cli/config/validate.content.pipeline.env";
import { writeCloudflareKv } from "@content-pipeline/photos/clients/write.cloudflare.kv";
import { archiveUploadedJournalDraft } from "@content-pipeline/journal/helpers/archive.uploaded.journal.draft";
import { loadJournalDraft } from "@content-pipeline/journal/helpers/load.journal.draft";
import { normaliseJournalDraft } from "@content-pipeline/journal/helpers/normalise.journal.draft";

export const runUploadJournalCommand = async ({
  environment,
}: ContentCommandOptions): Promise<void> => {
  validateContentPipelineEnv(environment);
  const env = loadContentPipelineEnv(environment);

  const { draftFolderPath, journal } = await loadJournalDraft();
  const normalisedJournal = normaliseJournalDraft(journal);

  await writeCloudflareKv({
    accountId: env.cloudflareAccountId,
    apiToken: env.cloudflareKvApiToken,
    namespaceId: env.cloudflareKvJournalsNamespaceId,
    key: `journal:${normalisedJournal.core.id}`,
    value: normalisedJournal,
  });

  const archivedDraftPath = await archiveUploadedJournalDraft(
    draftFolderPath,
    environment,
  );

  console.log("\nJournal upload complete");

  console.log("\nSummary:");
  console.log(`• Environment: ${environment}`);
  console.log(`• KV key: journal:${normalisedJournal.core.id}`);
  console.log(`• KV namespace: ${env.cloudflareKvJournalsNamespaceId}`);
  console.log(`• Archived draft: ${archivedDraftPath}`);

  console.log("\nNext:");
  console.log("1. Verify KV record (journal:{id})");
  console.log("2. View on site if applicable\n");
};
