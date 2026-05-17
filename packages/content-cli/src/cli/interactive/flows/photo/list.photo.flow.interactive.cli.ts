// packages/content-cli/src/cli/interactive/flows/photo/list.photo.flow.interactive.cli.ts

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

export const runPhotoListFlow = async (
  state: InteractiveCliState,
): Promise<void> => {
  await runInteractiveContentCommand({
    env: state.env,
    entity: "photo",
    action: "list",
  });
};
