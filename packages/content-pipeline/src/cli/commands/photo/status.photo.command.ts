// packages/content-pipeline/src/cli/commands/photo/status.photo.command.ts

import type { ContentCommandOptions } from "@content-pipeline/cli/types/command.options.types";

import { getDraftKindStatus } from "@content-pipeline/drafts/helpers/get.workspace.status.helper";

export const runStatusPhotoCommand = async (
  _options: ContentCommandOptions,
): Promise<void> => {
  const status = await getDraftKindStatus("photo");

  console.log("\nPhoto status");

  if (status.latestDraft) {
    console.log("\nLatest draft:");
    console.log(`- id: ${status.latestDraft.id}`);
    console.log(`- path: ${status.latestDraft.path}`);
    console.log(`- images: ${status.latestDraft.imageCount}`);
    console.log(`- draft files: ${status.latestDraft.draftFileCount}`);
  } else {
    console.log("\nLatest draft: none");
  }

  if (status.latestUploaded) {
    console.log("\nLatest uploaded:");
    console.log(`- id: ${status.latestUploaded.id}`);
    console.log(`- path: ${status.latestUploaded.path}`);
    console.log(`- images: ${status.latestUploaded.imageCount}`);
    console.log(`- draft files: ${status.latestUploaded.draftFileCount}`);
  } else {
    console.log("\nLatest uploaded: none");
  }

  console.log();
};
