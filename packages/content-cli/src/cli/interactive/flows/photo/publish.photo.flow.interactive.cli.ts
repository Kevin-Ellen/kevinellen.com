// packages/content-cli/src/cli/interactive/flows/photo/publish.photo.flow.interactive.cli.ts

import { cancel, confirm, isCancel, text } from "@clack/prompts";

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

export const runPhotoPublishFlow = async (
  state: InteractiveCliState,
): Promise<void> => {
  const photoId = await text({
    message: "Photo ID to publish",
  });

  if (isCancel(photoId)) {
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
    entity: "photo",
    action: "validate",
    photoId,
  });

  await runInteractiveContentCommand({
    env: state.env,
    entity: "photo",
    action: "publish",
    photoId,
  });
};
