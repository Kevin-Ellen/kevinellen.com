// packages/content-cli/src/cli/interactive/menus/promote.menu.interactive.cli.ts

import { cancel, isCancel, select } from "@clack/prompts";

import { runJournalPromoteFlow } from "@content-cli/cli/interactive/flows/journal/promote.journal.flow.interactive.cli";

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

export const runPromoteInteractiveMenu = async (
  state: InteractiveCliState,
): Promise<void> => {
  const action = await select({
    message: "🐦 Promote",
    options: [
      { value: "dev-stg", label: "Journal DEV → STG" },
      { value: "stg-prod", label: "Journal STG → PROD" },
      { value: "dev-prod", label: "Journal DEV → PROD" },
      { value: "back", label: "Back" },
    ],
  });

  if (isCancel(action)) {
    cancel("Cancelled.");
    return;
  }

  if (action === "back") return;

  if (action === "dev-stg") {
    await runJournalPromoteFlow(state, "dev", "stg");
  }

  if (action === "stg-prod") {
    await runJournalPromoteFlow(state, "stg", "prod");
  }

  if (action === "dev-prod") {
    await runJournalPromoteFlow(state, "dev", "prod");
  }
};
