// packages/content-cli/src/cli/interactive/flows/journal/publish.journal.flow.interactive.cli.ts

import { cancel, confirm, isCancel, text } from "@clack/prompts";

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

export const runJournalPublishFlow = async (
  state: InteractiveCliState,
): Promise<void> => {
  const slug = await text({
    message: "Journal slug to publish",
  });

  if (isCancel(slug)) {
    cancel("Cancelled.");
    return;
  }

  if (state.env === "prod") {
    const confirmed = await confirm({
      message: "⚠ This will publish to PROD. Continue?",
    });

    if (isCancel(confirmed) || !confirmed) {
      cancel("Publish cancelled.");
      return;
    }
  }

  await runInteractiveContentCommand({
    env: state.env,
    entity: "journal",
    action: "validate",
    slug,
  });

  await runInteractiveContentCommand({
    env: state.env,
    entity: "journal",
    action: "publish",
    slug,
  });
};
