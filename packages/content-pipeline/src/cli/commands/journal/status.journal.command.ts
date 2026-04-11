// packages/content-pipeline/src/cli/commands/journal/status.journal.command.ts

import type { ContentCommandOptions } from "@content-pipeline/cli/types/command.options.types";

import { getDraftKindStatus } from "@content-pipeline/drafts/helpers/get.workspace.status.helper";

export const runStatusJournalCommand = async (
  _options: ContentCommandOptions,
): Promise<void> => {
  const status = await getDraftKindStatus("journal");

  console.log("\nJournal status");

  if (status.latestDraft) {
    console.log("\nLatest draft:");
    console.log(`- id: ${status.latestDraft.id}`);
    console.log(`- path: ${status.latestDraft.path}`);
    console.log(`- images: ${status.latestDraft.imageCount}`);
    console.log(`- draft files: ${status.latestDraft.draftFileCount}`);
    console.log(
      `- has journal draft: ${status.latestDraft.hasJournalDraftFile}`,
    );
  } else {
    console.log("\nLatest draft: none");
  }

  if (status.latestUploaded) {
    console.log("\nLatest uploaded:");
    console.log(`- id: ${status.latestUploaded.id}`);
    console.log(`- path: ${status.latestUploaded.path}`);
    console.log(`- images: ${status.latestUploaded.imageCount}`);
    console.log(`- draft files: ${status.latestUploaded.draftFileCount}`);
    console.log(
      `- has journal draft: ${status.latestUploaded.hasJournalDraftFile}`,
    );
  } else {
    console.log("\nLatest uploaded: none");
  }

  console.log();
};
