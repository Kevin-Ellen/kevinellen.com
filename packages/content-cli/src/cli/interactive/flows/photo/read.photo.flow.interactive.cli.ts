// packages/content-cli/src/cli/interactive/flows/photo/read.photo.flow.interactive.cli.ts

import { cancel, isCancel, text } from "@clack/prompts";

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

export const runPhotoReadFlow = async (
  state: InteractiveCliState,
): Promise<void> => {
  const photoId = await text({
    message: "Photo ID to read from KV",
  });

  if (isCancel(photoId)) {
    cancel("Cancelled.");
    return;
  }

  await runInteractiveContentCommand({
    env: state.env,
    entity: "photo",
    action: "read",
    photoId,
  });
};
