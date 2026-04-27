// packages/content-cli/src/cli/interactive/flows/photo/generate.photo.flow.interactive.cli.ts

import { cancel, isCancel, text } from "@clack/prompts";

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

export const runPhotoGenerateFlow = async (
  state: InteractiveCliState,
): Promise<void> => {
  const photoId = await text({
    message: "Photo ID",
    placeholder: "mallorca-glossy-ibis-flight",
  });

  if (isCancel(photoId)) {
    cancel("Cancelled.");
    return;
  }

  await runInteractiveContentCommand({
    env: state.env,
    entity: "photo",
    action: "generate",
    photoId,
  });
};
