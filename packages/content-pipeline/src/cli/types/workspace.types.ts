// packages/content-pipeline/src/cli/types/workspace.types.ts

type WorkspaceLocation = "draft" | "uploaded";

export type WorkspaceSummary = {
  id: string;
  path: string;
  imageCount: number;
  draftFileCount: number;
  hasJournalDraftFile?: boolean;
  location: WorkspaceLocation;
};
