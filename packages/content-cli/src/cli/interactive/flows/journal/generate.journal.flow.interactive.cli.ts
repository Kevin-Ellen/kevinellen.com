// packages/content-cli/src/cli/interactive/flows/journal/generate.journal.flow.interactive.cli.ts

import { cancel, isCancel, text } from "@clack/prompts";

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

export const runJournalGenerateFlow = async (
  state: InteractiveCliState,
): Promise<void> => {
  const slug = await text({
    message: "Journal slug",
    placeholder: "unexpected-encounters-salbufera-mallorca",
  });

  if (isCancel(slug)) {
    cancel("Cancelled.");
    return;
  }

  await runInteractiveContentCommand({
    env: state.env,
    entity: "journal",
    action: "generate",
    slug,
  });
};
