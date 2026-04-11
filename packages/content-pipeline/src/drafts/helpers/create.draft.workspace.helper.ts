// packages/content-pipeline/src/drafts/helpers/create.draft.workspace.helper.ts

import fs from "node:fs/promises";
import path from "node:path";

import type {
  DraftKind,
  DraftWorkspace,
} from "@content-pipeline/drafts/types/draft.workspace.types";

const AUTHORING_CONTENT_ROOT = path.resolve(process.cwd(), "content-pipeline");

const pad = (value: number): string => String(value).padStart(2, "0");

export const formatTimestamp = (date: Date): string => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day}T${hours}-${minutes}-${seconds}`;
};

const resolveDraftRoot = (kind: DraftKind): string => {
  return path.join(AUTHORING_CONTENT_ROOT, kind, "drafts");
};

export const createDraftWorkspace = async (
  kind: DraftKind,
): Promise<DraftWorkspace> => {
  const draftId = formatTimestamp(new Date());

  const draftRoot = resolveDraftRoot(kind);

  const draftPath = path.join(draftRoot, draftId);
  const imagesPath = path.join(draftPath, "images");

  // Guard: prevent accidental overwrite (very unlikely, but safe)
  try {
    await fs.access(draftPath);
    throw new Error(`Draft folder already exists: ${draftPath}`);
  } catch {
    // Expected: folder does not exist
  }

  await fs.mkdir(imagesPath, { recursive: true });

  return {
    kind,
    draftId,
    draftPath,
    imagesPath,
  };
};
