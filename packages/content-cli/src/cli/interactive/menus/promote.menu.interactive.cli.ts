// packages/content-cli/src/cli/interactive/menus/promote.menu.interactive.cli.ts

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";
import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";

import { cancel, isCancel, select } from "@clack/prompts";

import { runJournalPromoteFlow } from "@content-cli/cli/interactive/flows/journal/promote.journal.flow.interactive.cli";
import { runNotePromoteFlow } from "@content-cli/cli/interactive/flows/note/promote.note.flow.interactive.cli";

type PromoteEntity = "journal" | "note";
type PromoteRoute = "dev-stg" | "stg-prod" | "dev-prod";

type PromoteMenuAction = `${PromoteEntity}:${PromoteRoute}` | "back";

const promoteRoutes: Record<
  PromoteRoute,
  [from: ContentCliEnvironment, to: ContentCliEnvironment]
> = {
  "dev-stg": ["dev", "stg"],
  "stg-prod": ["stg", "prod"],
  "dev-prod": ["dev", "prod"],
};

export const runPromoteInteractiveMenu = async (
  state: InteractiveCliState,
): Promise<void> => {
  const action = await select<PromoteMenuAction>({
    message: "🐦 Promote",
    options: [
      { value: "journal:dev-stg", label: "Journal DEV → STG" },
      { value: "journal:stg-prod", label: "Journal STG → PROD" },
      { value: "journal:dev-prod", label: "Journal DEV → PROD" },

      { value: "note:dev-stg", label: "Note DEV → STG" },
      { value: "note:stg-prod", label: "Note STG → PROD" },
      { value: "note:dev-prod", label: "Note DEV → PROD" },

      { value: "back", label: "Back" },
    ],
  });

  if (isCancel(action)) {
    cancel("Cancelled.");
    return;
  }

  if (action === "back") return;

  const [entity, route] = action.split(":") as [PromoteEntity, PromoteRoute];

  const flowArgs = promoteRoutes[route];

  if (!flowArgs) {
    throw new Error(`No promote flow defined for action: ${action}`);
  }

  const [from, to] = flowArgs;

  if (entity === "journal") {
    await runJournalPromoteFlow(state, from, to);
    return;
  }

  await runNotePromoteFlow(state, from, to);
};
