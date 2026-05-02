// packages/content-cli/src/cli/interactive/flows/photo/validate.photo.flow.interactive.cli.ts

import { cancel, isCancel, text } from "@clack/prompts";

import { runInteractiveContentCommand } from "@content-cli/cli/interactive/command.interactive.cli";

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

export const runPhotoValidateFlow = async (
  state: InteractiveCliState,
): Promise<void> => {
  const workspaceId = await text({
    message: "Photo workspace ID to validate",
    placeholder: "2026-05-02T19-55-10+01-00",
  });

  if (isCancel(workspaceId)) {
    cancel("Cancelled.");
    return;
  }

  const slug = workspaceId.trim();

  if (!slug) {
    cancel("Photo validate requires a workspace ID.");
    return;
  }

  await runInteractiveContentCommand({
    env: state.env,
    entity: "photo",
    action: "validate",
    slug,
  });
};
