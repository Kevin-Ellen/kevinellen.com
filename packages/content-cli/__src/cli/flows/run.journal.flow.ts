// packages/content-pipeline/src/cli/flows/run.journal.flow.ts

import { isCancel, select } from "@clack/prompts";

import { getNextStepAction } from "@content-pipeline/cli/flows/helpers/get.next.step.action";
import { resolveSelectedWorkspaceId } from "@content-pipeline/cli/flows/helpers/resolve.selected.workspace.id.helper";
import { contentCommandRegistry } from "@content-pipeline/cli/registry/content.command.registry";
import { selectNextStepPrompt } from "@content-pipeline/cli/ui/prompts/select.next.step.prompt";

import type { ContentCliAction } from "@content-pipeline/cli/types/cli.types";
import type { ContentPipelineEnvironment } from "@content-pipeline/config/types/content.pipeline.environment.types";

export const runJournalFlow = async (
  env: ContentPipelineEnvironment,
): Promise<void> => {
  let activeDraftId: string | undefined;

  while (true) {
    const selection = await select({
      message: "Journal",
      options: [
        { value: "start", label: "Start new journal draft" },
        { value: "create", label: "Create journal draft" },
        { value: "upload", label: "Upload journal workspace" },
        { value: "pull", label: "Pull published journal for editing" },
        { value: "reupload", label: "Re-upload edited journal" },
        { value: "status", label: "View journal workspace status" },
        { value: "back", label: "Back" },
      ],
    });

    if (isCancel(selection) || selection === "back") {
      return;
    }

    const action = selection as ContentCliAction;
    const command = contentCommandRegistry.journal?.[action];

    if (!command) {
      throw new Error("Unsupported journal command.");
    }

    const draftId =
      action === "create" || action === "upload"
        ? await resolveSelectedWorkspaceId("journal", activeDraftId)
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

    const nextCommand = contentCommandRegistry.journal?.[nextAction];

    if (!nextCommand) {
      throw new Error("Unsupported journal command.");
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
