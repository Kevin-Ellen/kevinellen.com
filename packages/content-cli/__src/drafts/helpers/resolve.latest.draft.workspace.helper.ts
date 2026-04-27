// packages/content-pipeline/src/drafts/helpers/resolve.latest.draft.workspace.helper.ts

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

export const resolveLatestDraftWorkspace = async (
  kind: DraftKind,
): Promise<DraftWorkspace> => {
  const draftRoot = resolveDraftRoot(kind);

  const entries = await fs.readdir(draftRoot, {
    withFileTypes: true,
  });

  const draftIds = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const latestDraftId = draftIds.at(-1);

  if (!latestDraftId) {
    throw new Error(`No ${kind} draft folders found in: ${draftRoot}`);
  }

  const draftPath = path.join(draftRoot, latestDraftId);
  const imagesPath = path.join(draftPath, "images");

  return {
    kind,
    draftId: latestDraftId,
    draftPath,
    imagesPath,
  };
};
