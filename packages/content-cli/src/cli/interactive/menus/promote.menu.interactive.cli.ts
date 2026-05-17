// packages/content-cli/src/cli/interactive/menus/promote.menu.interactive.cli.ts

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";
import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";

import { cancel, isCancel, select } from "@clack/prompts";

import { runJournalPromoteFlow } from "@content-cli/cli/interactive/flows/journal/promote.journal.flow.interactive.cli";

type PromoteMenuAction = "dev-stg" | "stg-prod" | "dev-prod" | "back";

export const runPromoteInteractiveMenu = async (
  state: InteractiveCliState,
): Promise<void> => {
  const action = await select<PromoteMenuAction>({
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

  const actionMap: Record<
    Exclude<PromoteMenuAction, "back">,
    [from: ContentCliEnvironment, to: ContentCliEnvironment]
  > = {
    "dev-stg": ["dev", "stg"],
    "stg-prod": ["stg", "prod"],
    "dev-prod": ["dev", "prod"],
  };

  const flowArgs = actionMap[action];
  if (!flowArgs) {
    throw new Error(`No promote flow defined for action: ${action}`);
  }

  await runJournalPromoteFlow(state, flowArgs[0], flowArgs[1]);
};
