// packages/content-cli/src/cli/interactive/flows/note/create.note.flow.interactive.cli.ts

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";
import type { ContentCommandResult } from "@content-cli/commands/types/command.types";

import { cancel, isCancel, note, select, spinner } from "@clack/prompts";

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";
import { isNoteCreateCommandResult } from "@content-cli/cli/interactive/results.interactive.cli";
import { safeRunInteractiveStep } from "@content-cli/cli/interactive/safe-run.interactive.cli";

export const runNoteCreateFlow = async (
  state: InteractiveCliState,
): Promise<void> => {
  const s = spinner();

  s.start("Creating note workspace");

  let result: ContentCommandResult | undefined;

  const created = await safeRunInteractiveStep("Note create", async () => {
    result = await runInteractiveContentCommand({
      env: state.env,
      entity: "note",
      action: "create",
    });
  });

  s.stop(created ? "✅ Note workspace created" : "⚠ Note create failed");

  if (!created || !result) return;

  if (!isNoteCreateCommandResult(result)) {
    note(
      "Note workspace was created, but no workspace ID was returned.",
      "⚠ Missing result data",
    );

    return;
  }

  const workspaceId = result.workspaceId;

  const nextAction = await select({
    message: "Next step?",
    options: [
      { value: "generate", label: "Generate draft now" },
      { value: "back", label: "Back to Note" },
      { value: "main", label: "Return to main menu" },
      { value: "exit", label: "Exit" },
    ],
  });

  if (isCancel(nextAction)) {
    cancel("Cancelled.");
    return;
  }

  switch (nextAction) {
    case "generate":
      await safeRunInteractiveStep("Note generate", async () => {
        await runInteractiveContentCommand({
          env: state.env,
          entity: "note",
          action: "generate",
          slug: workspaceId,
        });
      });
      break;

    case "exit":
      process.exit(0);
  }
};
