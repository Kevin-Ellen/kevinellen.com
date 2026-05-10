// packages/content-cli/src/cli/interactive/flows/note/validate.note.flow.interactive.cli.ts

import { cancel, isCancel, text } from "@clack/prompts";

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

export const runNoteValidateFlow = async (
  state: InteractiveCliState,
): Promise<void> => {
  const slug = await text({
    message: "Note slug to validate",
  });

  if (isCancel(slug)) {
    cancel("Cancelled.");
    return;
  }

  await runInteractiveContentCommand({
    env: state.env,
    entity: "note",
    action: "validate",
    slug,
  });
};
