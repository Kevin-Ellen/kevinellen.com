// packages/content-pipeline/src/drafts/helpers/resolve.draft.workspace.by.id.helper.ts

import fs from "node:fs/promises";
import path from "node:path";

import type {
  DraftKind,
  DraftWorkspace,
} from "@content-pipeline/drafts/types/draft.workspace.types";

const AUTHORING_CONTENT_ROOT = path.resolve(process.cwd(), "content-pipeline");

const resolveDraftRoot = (kind: DraftKind): string => {
  return path.join(AUTHORING_CONTENT_ROOT, kind, "drafts");
};

export const resolveDraftWorkspaceById = async (
  kind: DraftKind,
  draftId: string,
): Promise<DraftWorkspace> => {
  const draftPath = path.join(resolveDraftRoot(kind), draftId);
  const imagesPath = path.join(draftPath, "images");

  await fs.access(draftPath);
  await fs.access(imagesPath);

  return {
    kind,
    draftId,
    draftPath,
    imagesPath,
  };
};
