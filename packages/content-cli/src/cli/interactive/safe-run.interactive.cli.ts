// packages/content-cli/src/cli/interactive/safe-run.interactive.cli.ts

import { note } from "@clack/prompts";

export const safeRunInteractiveStep = async (
  label: string,
  step: () => Promise<void>,
): Promise<boolean> => {
  try {
    await step();
    return true;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown interactive CLI error.";

    note(message, `⚠ ${label} failed`);

    return false;
  }
};
