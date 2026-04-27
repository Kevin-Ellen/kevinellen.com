// packages/content-cli/src/cli/interactive/flows/photo/create.photo.flow.interactive.cli.ts

import { cancel, isCancel, select, spinner } from "@clack/prompts";

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

export const runPhotoCreateFlow = async (
  state: InteractiveCliState,
): Promise<void> => {
  const s = spinner();

  s.start("Creating photo workspace");

  await runInteractiveContentCommand({
    env: state.env,
    entity: "photo",
    action: "create",
  });

  s.stop("✅ Photo workspace created");

  const nextAction = await select({
    message: "Next step?",
    options: [
      { value: "generate", label: "Generate draft now" },
      { value: "back", label: "Back to Photo" },
      { value: "main", label: "Return to main menu" },
      { value: "exit", label: "Exit" },
    ],
  });

  if (isCancel(nextAction)) {
    cancel("Cancelled.");
    return;
  }

  if (nextAction === "generate") {
    await runInteractiveContentCommand({
      env: state.env,
      entity: "photo",
      action: "generate",
    });
  }

  if (nextAction === "exit") {
    process.exit(0);
  }
};
