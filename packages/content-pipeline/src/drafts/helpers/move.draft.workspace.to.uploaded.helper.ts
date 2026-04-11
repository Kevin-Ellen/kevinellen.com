// packages/content-pipeline/src/drafts/helpers/move.draft.workspace.to.uploaded.helper.ts

import fs from "node:fs/promises";
import path from "node:path";

import type {
  DraftKind,
  DraftWorkspace,
} from "@content-pipeline/drafts/types/draft.workspace.types";

const AUTHORING_CONTENT_ROOT = path.resolve(process.cwd(), "content-pipeline");

const resolveDraftsRoot = (kind: DraftKind): string => {
  return path.join(AUTHORING_CONTENT_ROOT, kind, "drafts");
};

const resolveUploadedRoot = (kind: DraftKind): string => {
  return path.join(AUTHORING_CONTENT_ROOT, kind, "uploaded");
};

export const moveDraftWorkspaceToUploaded = async (
  workspace: DraftWorkspace,
): Promise<string> => {
  const draftsRoot = resolveDraftsRoot(workspace.kind);
  const uploadedRoot = resolveUploadedRoot(workspace.kind);

  const sourcePath = workspace.draftPath;
  const targetPath = path.join(uploadedRoot, workspace.draftId);

  await fs.mkdir(draftsRoot, { recursive: true });
  await fs.mkdir(uploadedRoot, { recursive: true });

  try {
    await fs.access(targetPath);
    throw new Error(`Uploaded workspace already exists: ${targetPath}`);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code !== "ENOENT") {
      throw error;
    }
  }

  await fs.rename(sourcePath, targetPath);

  return targetPath;
};
