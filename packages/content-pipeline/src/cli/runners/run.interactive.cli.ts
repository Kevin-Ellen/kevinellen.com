// packages/content-pipeline/src/cli/runners/run.interactive.cli.ts

import { cancel, isCancel, select } from "@clack/prompts";

import { contentCommandRegistry } from "@content-pipeline/cli/registry/content.command.registry";
import { runInteractiveCli as runInteractiveMenu } from "@content-pipeline/cli/ui/run.interactive.cli";

import type { ContentCommandOptions } from "@content-pipeline/cli/types/command.options.types";

export const runInteractiveCli = async (
  env: ContentCommandOptions["env"],
): Promise<void> => {
  let shouldExit = false;

  while (!shouldExit) {
    const selection = await runInteractiveMenu(env);

    if (!selection) {
      return;
    }

    const command =
      contentCommandRegistry[selection.entity]?.[selection.action];

    if (!command) {
      throw new Error("Unsupported CLI command.");
    }

    await command({ env });

    const nextAction = await select({
      message: "What next?",
      options: [
        {
          value: "menu",
          label: "Return to main menu",
        },
        {
          value: "exit",
          label: "Exit",
        },
      ],
    });

    if (isCancel(nextAction) || nextAction === "exit") {
      cancel("Cancelled");
      shouldExit = true;
    }
  }
};
