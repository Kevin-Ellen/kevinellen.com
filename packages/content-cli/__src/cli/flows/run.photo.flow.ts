// packages/content-pipeline/src/cli/flows/run.photo.flow.ts

import { isCancel, select } from "@clack/prompts";

import { getNextStepAction } from "@content-pipeline/cli/flows/helpers/get.next.step.action";
import { resolveSelectedWorkspaceId } from "@content-pipeline/cli/flows/helpers/resolve.selected.workspace.id.helper";
import { contentCommandRegistry } from "@content-pipeline/cli/registry/content.command.registry";
import { selectNextStepPrompt } from "@content-pipeline/cli/ui/prompts/select.next.step.prompt";

import type { ContentCliAction } from "@content-pipeline/cli/types/cli.types";
import type { ContentPipelineEnvironment } from "@content-pipeline/config/types/content.pipeline.environment.types";

export const runPhotoFlow = async (
  env: ContentPipelineEnvironment,
): Promise<void> => {
  let activeDraftId: string | undefined;

  while (true) {
    const selection = await select({
      message: "Photos",
      options: [
        { value: "start", label: "Start new photo draft" },
        { value: "create", label: "Create photo draft(s)" },
        { value: "upload", label: "Upload photo workspace" },
        { value: "status", label: "View photo workspace status" },
        { value: "back", label: "Back" },
      ],
    });

    if (isCancel(selection) || selection === "back") {
      return;
    }

    const action = selection as ContentCliAction;
    const command = contentCommandRegistry.photo?.[action];

    if (!command) {
      throw new Error("Unsupported photo command.");
    }

    const draftId =
      action === "create" || action === "upload"
        ? await resolveSelectedWorkspaceId("photo", activeDraftId)
        : undefined;

    if ((action === "create" || action === "upload") && !draftId) {
      continue;
    }

    const result = await command({
      env,
      draftId,
    });

    const workspace = result?.workspace;

    activeDraftId = workspace?.draftId ?? activeDraftId;

    if (action === "upload") {
      activeDraftId = undefined;
      continue;
    }

    const nextAction = getNextStepAction(action);

    if (!workspace || !nextAction) {
      continue;
    }

    const nextStep = await selectNextStepPrompt(nextAction);

    if (nextStep === "exit") {
      return;
    }

    if (nextStep === "back") {
      continue;
    }

    const nextCommand = contentCommandRegistry.photo?.[nextAction];

    if (!nextCommand) {
      throw new Error("Unsupported photo command.");
    }

    const nextResult = await nextCommand({
      env,
      draftId: workspace.draftId,
    });

    activeDraftId = nextResult?.workspace?.draftId ?? workspace.draftId;

    if (nextAction === "upload") {
      activeDraftId = undefined;
    }
  }
};
