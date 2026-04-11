// packages/content-pipeline/src/cli/commands/photo/start.photo.command.ts

import type { ContentCommandOptions } from "@content-pipeline/cli/types/command.options.types";
import type { DraftWorkspace } from "@content-pipeline/drafts/types/draft.workspace.types";

import { createDraftWorkspace } from "@content-pipeline/drafts/helpers/create.draft.workspace.helper";

export const runStartPhotoCommand = async (
  _options: ContentCommandOptions,
): Promise<DraftWorkspace> => {
  const workspace = await createDraftWorkspace("photo");

  console.log("\nPhoto draft workspace created");
  console.log(`→ ${workspace.draftPath}`);
  console.log("\nNext steps:");
  console.log("1. Add one or more images to the images/ folder");
  console.log("2. Continue here when ready, or run: content photo create");
  console.log("3. Open the draft folder in your editor");
  console.log(`   code ${workspace.draftPath}\n`);

  return workspace;
};
