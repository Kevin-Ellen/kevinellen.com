// packages/content-cli/src/cli/interactive/flows/journal/create.journal.flow.interactive.cli.ts

import { cancel, isCancel, note, select, spinner } from "@clack/prompts";

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";
import { isJournalCreateCommandResult } from "@content-cli/cli/interactive/results.interactive.cli";
import { safeRunInteractiveStep } from "@content-cli/cli/interactive/safe-run.interactive.cli";

import type { ContentCommandResult } from "@content-cli/commands/types/command.types";
import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

export const runJournalCreateFlow = async (
  state: InteractiveCliState,
): Promise<void> => {
  const s = spinner();

  s.start("Creating journal workspace");

  let result: ContentCommandResult | undefined;

  const created = await safeRunInteractiveStep("Journal create", async () => {
    result = await runInteractiveContentCommand({
      env: state.env,
      entity: "journal",
      action: "create",
    });
  });

  s.stop(created ? "✅ Journal workspace created" : "⚠ Journal create failed");

  if (!created || !result) {
    return;
  }

  if (!isJournalCreateCommandResult(result)) {
    note(
      "Journal workspace was created, but no workspace ID was returned.",
      "⚠ Missing result data",
    );
    return;
  }

  const nextAction = await select({
    message: "Next step?",
    options: [
      { value: "generate", label: "Generate draft now" },
      { value: "back", label: "Back to Journal" },
      { value: "main", label: "Return to main menu" },
      { value: "exit", label: "Exit" },
    ],
  });

  if (isCancel(nextAction)) {
    cancel("Cancelled.");
    return;
  }

  if (nextAction === "generate") {
    const workspaceId = result.workspaceId;

    await safeRunInteractiveStep("Journal generate", async () => {
      await runInteractiveContentCommand({
        env: state.env,
        entity: "journal",
        action: "generate",
        slug: workspaceId,
      });
    });
  }

  if (nextAction === "exit") {
    process.exit(0);
  }
};
