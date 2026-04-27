// packages/content-pipeline/cli/commands/journal/start.journal.command.ts

import type { ContentCommandOptions } from "@content-pipeline/cli/types/command.options.types";
import type { ContentCommandResult } from "@content-pipeline/cli/types/command.definition.types";

import { createDraftWorkspace } from "@content-pipeline/drafts/helpers/create.draft.workspace.helper";

export const runStartJournalCommand = async (
  _options: ContentCommandOptions,
): Promise<ContentCommandResult> => {
  const workspace = await createDraftWorkspace("journal");

  console.log("\nJournal draft workspace created");
  console.log(`→ ${workspace.draftPath}`);
  console.log("\nNext steps:");
  console.log("1. Add zero, one, or many images to the images/ folder");
  console.log("2. Continue here when ready, or run: content journal create");
  console.log("3. Open the draft folder in your editor");
  console.log(`   code ${workspace.draftPath}\n`);

  return {
    workspace,
  };
};
