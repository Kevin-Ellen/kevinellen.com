// packages/content-cli/src/cli/interactive/flows/photo/homepage-strip-rebuild.photo.flow.interactive.cli.ts

import { confirm, isCancel, cancel } from "@clack/prompts";

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

export const runPhotoHomepageStripRebuildFlow = async (
  state: InteractiveCliState,
): Promise<void> => {
  const shouldRebuild = await confirm({
    message:
      "Rebuild photo:index:homepage-strip from all published photos in prod KV?",
    initialValue: false,
  });

  if (isCancel(shouldRebuild)) {
    cancel("Cancelled.");
    return;
  }

  if (!shouldRebuild) {
    return;
  }

  await runInteractiveContentCommand({
    env: "prod",
    entity: "photo",
    action: "homepageStripRebuild",
  });
};
