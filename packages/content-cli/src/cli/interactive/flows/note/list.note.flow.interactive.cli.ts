// packages/content-cli/src/cli/interactive/flows/note/list.note.flow.interactive.cli.ts

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

export const runNoteListFlow = async (
  state: InteractiveCliState,
): Promise<void> => {
  await runInteractiveContentCommand({
    env: state.env,
    entity: "note",
    action: "list",
  });
};
