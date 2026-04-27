// packages/content-cli/src/cli/interactive/menus/photo.menu.interactive.cli.ts

import { cancel, isCancel, select } from "@clack/prompts";

import { runPhotoCreateFlow } from "@content-cli/cli/interactive/flows/photo/create.photo.flow.interactive.cli";
import { runPhotoGenerateFlow } from "@content-cli/cli/interactive/flows/photo/generate.photo.flow.interactive.cli";
import { runPhotoValidateFlow } from "@content-cli/cli/interactive/flows/photo/validate.photo.flow.interactive.cli";
import { runPhotoPublishFlow } from "@content-cli/cli/interactive/flows/photo/publish.photo.flow.interactive.cli";
import { runPhotoReadFlow } from "@content-cli/cli/interactive/flows/photo/read.photo.flow.interactive.cli";
import { runPhotoListFlow } from "@content-cli/cli/interactive/flows/photo/list.photo.flow.interactive.cli";
import { runPhotoStatusFlow } from "@content-cli/cli/interactive/flows/photo/status.photo.flow.interactive.cli";

import type { InteractiveCliState } from "@content-cli/cli/interactive/state.interactive.cli";

export const runPhotoInteractiveMenu = async (
  state: InteractiveCliState,
): Promise<void> => {
  while (true) {
    const action = await select({
      message: "📷 Photo",
      options: [
        { value: "create", label: "Create" },
        { value: "generate", label: "Generate" },
        { value: "validate", label: "✅ Validate" },
        { value: "publish", label: "🪶 Publish" },
        { value: "read", label: "Read from KV" },
        { value: "list", label: "List" },
        { value: "status", label: "Status" },
        { value: "back", label: "Back" },
      ],
    });

    if (isCancel(action)) {
      cancel("Cancelled.");
      return;
    }

    if (action === "back") return;
    if (action === "create") await runPhotoCreateFlow(state);
    if (action === "generate") await runPhotoGenerateFlow(state);
    if (action === "validate") await runPhotoValidateFlow(state);
    if (action === "publish") await runPhotoPublishFlow(state);
    if (action === "read") await runPhotoReadFlow(state);
    if (action === "list") await runPhotoListFlow(state);
    if (action === "status") await runPhotoStatusFlow(state);
  }
};
