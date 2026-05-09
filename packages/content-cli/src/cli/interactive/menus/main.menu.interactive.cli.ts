// packages/content-cli/src/cli/interactive/menus/main.menu.interactive.cli.ts

import { cancel, isCancel, select } from "@clack/prompts";

import { formatEnvironment } from "@content-cli/cli/interactive/format.interactive.cli";
import { runEnvironmentInteractiveMenu } from "@content-cli/cli/interactive/menus/environment.menu.interactive.cli";
import { runJournalInteractiveMenu } from "@content-cli/cli/interactive/menus/journal.menu.interactive.cli";
import { runPhotoInteractiveMenu } from "@content-cli/cli/interactive/menus/photo.menu.interactive.cli";
import { runPromoteInteractiveMenu } from "@content-cli/cli/interactive/menus/promote.menu.interactive.cli";

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

/**
 * Union type of all valid menu actions.
 */
type MainMenuAction = "journal" | "photo" | "promote" | "environment" | "exit";

/**
 * Runs the main interactive CLI menu.
 */
export const runMainInteractiveMenu = async (
  state: InteractiveCliState,
  maxIterations = Infinity, // optional: break loop for safe testing
): Promise<void> => {
  // Map actions (excluding 'exit') to handlers
  const actionMap: Record<
    Exclude<MainMenuAction, "exit">,
    (state: InteractiveCliState) => Promise<void>
  > = {
    environment: runEnvironmentInteractiveMenu,
    journal: runJournalInteractiveMenu,
    photo: runPhotoInteractiveMenu,
    promote: runPromoteInteractiveMenu,
  };

  let iterations = 0;

  while (iterations < maxIterations) {
    iterations++;

    const action = await select<MainMenuAction>({
      message: `Current environment: ${formatEnvironment(state.env)}`,
      options: [
        { value: "journal", label: "📘 Journal" },
        { value: "photo", label: "📷 Photo" },
        { value: "promote", label: "🐦 Promote" },
        { value: "environment", label: "🌍 Environment" },
        { value: "exit", label: "🚪 Exit" },
      ],
    });

    if (isCancel(action)) {
      cancel("Cancelled.");
      return;
    }

    if (action === "exit") return;

    // Handler exists because we typed action as union & mapped keys
    const handler = actionMap[action];
    if (!handler) {
      // This should never happen but satisfies coverage and TS
      throw new Error(`No handler found for action: ${action}`);
    }

    await handler(state);
  }
};
