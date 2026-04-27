// packages/content-cli/src/cli/interactive/menus/main.menu.interactive.cli.ts

import { cancel, isCancel, select } from "@clack/prompts";

import { formatEnvironment } from "@content-cli/cli/interactive/format.interactive.cli";
import { runEnvironmentInteractiveMenu } from "@content-cli/cli/interactive/menus/environment.menu.interactive.cli";
import { runJournalInteractiveMenu } from "@content-cli/cli/interactive/menus/journal.menu.interactive.cli";
import { runPhotoInteractiveMenu } from "@content-cli/cli/interactive/menus/photo.menu.interactive.cli";
import { runPromoteInteractiveMenu } from "@content-cli/cli/interactive/menus/promote.menu.interactive.cli";

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

export const runMainInteractiveMenu = async (
  state: InteractiveCliState,
): Promise<void> => {
  while (true) {
    const action = await select({
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

    if (action === "exit") {
      return;
    }

    if (action === "environment") {
      await runEnvironmentInteractiveMenu(state);
      continue;
    }

    if (action === "journal") {
      await runJournalInteractiveMenu(state);
      continue;
    }

    if (action === "photo") {
      await runPhotoInteractiveMenu(state);
      continue;
    }

    if (action === "promote") {
      await runPromoteInteractiveMenu(state);
    }
  }
};
