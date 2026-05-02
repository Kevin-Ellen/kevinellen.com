// packages/content-cli/src/cli/interactive/flows/photo/publish.photo.flow.interactive.cli.ts

import { cancel, confirm, isCancel, text } from "@clack/prompts";

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

export const runPhotoPublishFlow = async (
  state: InteractiveCliState,
): Promise<void> => {
  const workspaceId = await text({
    message: "Photo workspace ID to publish",
    placeholder: "2026-05-02T19-55-10+01-00",
  });

  if (isCancel(workspaceId)) {
    cancel("Cancelled.");
    return;
  }

  const slug = workspaceId.trim();

  if (!slug) {
    cancel("Photo publish requires a workspace ID.");
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
    slug,
  });

  await runInteractiveContentCommand({
    env: state.env,
    entity: "photo",
    action: "publish",
    slug,
  });
};
