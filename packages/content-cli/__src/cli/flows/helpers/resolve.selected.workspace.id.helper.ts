// packages/content-pipeline/src/cli/flows/helpers/resolve.selected.workspace.id.helper.ts

import { selectWorkspacePrompt } from "@content-pipeline/cli/ui/prompts/select.workspace.prompt";
import { listDraftWorkspaceSummaries } from "@content-pipeline/drafts/helpers/list.draft.workspace.summaries.helper";

import type { DraftKind } from "@content-pipeline/drafts/types/draft.workspace.types";

export const resolveSelectedWorkspaceId = async (
  kind: DraftKind,
  currentDraftId?: string,
): Promise<string | undefined> => {
  if (currentDraftId) {
    return currentDraftId;
  }

  const workspaces = await listDraftWorkspaceSummaries(kind);

  if (workspaces.length === 0) {
    console.log(`No ${kind} draft workspaces found.`);
    return undefined;
  }

  return (await selectWorkspacePrompt(kind, workspaces)) ?? undefined;
};
