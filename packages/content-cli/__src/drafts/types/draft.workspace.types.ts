// packages/content-pipeline/src/drafts/types/draft.workspace.types.ts

export type DraftKind = "photo" | "journal";

export type DraftWorkspace = {
  kind: DraftKind;
  draftId: string;
  draftPath: string;
  imagesPath: string;
};
