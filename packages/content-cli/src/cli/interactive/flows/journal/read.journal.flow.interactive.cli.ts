// packages/content-cli/src/cli/interactive/flows/journal/read.journal.flow.interactive.cli.ts

import { cancel, isCancel, text } from "@clack/prompts";

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";
import { safeRunInteractiveStep } from "@content-cli/cli/interactive/safe-run.interactive.cli";

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

export const runJournalReadFlow = async (
  state: InteractiveCliState,
): Promise<void> => {
  const slug = await text({
    message: "Journal slug to read from KV",
  });

  if (isCancel(slug)) {
    cancel("Cancelled.");
    return;
  }

  await safeRunInteractiveStep("Journal read", async () => {
    await runInteractiveContentCommand({
      env: state.env,
      entity: "journal",
      action: "read",
      slug,
    });
  });
};
