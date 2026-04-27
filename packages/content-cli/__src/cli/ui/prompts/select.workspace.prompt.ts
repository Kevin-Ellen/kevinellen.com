// packages/content-pipeline/src/cli/ui/prompts/select.workspace.prompt.ts

import { cancel, isCancel, select } from "@clack/prompts";

import type { WorkspaceSummary } from "@content-pipeline/cli/types/workspace.types";
import type { DraftKind } from "@content-pipeline/drafts/types/draft.workspace.types";

const pluralise = (count: number, singular: string, plural: string): string => {
  return count === 1 ? singular : plural;
};

const getPhotoWorkspaceLabel = (workspace: WorkspaceSummary): string => {
  return [
    workspace.id,
    `${workspace.imageCount} ${pluralise(workspace.imageCount, "image", "images")}`,
    `${workspace.draftFileCount} ${pluralise(workspace.draftFileCount, "draft", "drafts")}`,
  ].join(" — ");
};

const getJournalWorkspaceLabel = (workspace: WorkspaceSummary): string => {
  const journalState =
    workspace.hasJournalDraftFile === true
      ? "journal ready"
      : "no journal draft";

  return [
    workspace.id,
    `${workspace.imageCount} ${pluralise(workspace.imageCount, "image", "images")}`,
    journalState,
  ].join(" — ");
};

const getWorkspaceLabel = (
  kind: DraftKind,
  workspace: WorkspaceSummary,
): string => {
  if (kind === "journal") {
    return getJournalWorkspaceLabel(workspace);
  }

  return getPhotoWorkspaceLabel(workspace);
};

export const selectWorkspacePrompt = async (
  kind: DraftKind,
  workspaces: readonly WorkspaceSummary[],
): Promise<string | null> => {
  if (workspaces.length === 0) {
    return null;
  }

  if (workspaces.length === 1) {
    console.log(`Using draft: ${workspaces[0].id}`);
    return workspaces[0].id;
  }

  const selection = await select({
    message: `Choose a ${kind} workspace`,
    options: workspaces.map((workspace) => ({
      value: workspace.id,
      label: getWorkspaceLabel(kind, workspace),
      hint: workspace.path,
    })),
  });

  if (isCancel(selection)) {
    cancel("Cancelled");
    return null;
  }

  return selection;
};
