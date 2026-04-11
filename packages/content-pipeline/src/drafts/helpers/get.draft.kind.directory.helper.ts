// packages/content-pipeline/src/drafts/helpers/get.draft.kind.directory.helper.ts

import path from "node:path";

import type { DraftKind } from "@content-pipeline/drafts/types/draft.workspace.types";

const DRAFTS_ROOT = path.resolve(process.cwd(), "content-pipeline");

export const getDraftKindDirectory = (kind: DraftKind): string => {
  return path.join(DRAFTS_ROOT, kind, "drafts");
};
