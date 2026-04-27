// packages/content-pipeline/src/drafts/helpers/get.workspace.status.helper.ts

import fs from "node:fs/promises";
import path from "node:path";

import type { DraftKind } from "@content-pipeline/drafts/types/draft.workspace.types";

const AUTHORING_CONTENT_ROOT = path.resolve(process.cwd(), "content-pipeline");

type WorkspaceStatus = {
  id: string;
  path: string;
  exists: boolean;
  imageCount: number;
  draftFileCount: number;
  hasJournalDraftFile: boolean;
};

export type DraftKindStatus = {
  kind: DraftKind;
  latestDraft: WorkspaceStatus | null;
  latestUploaded: WorkspaceStatus | null;
};

const resolveRoot = (
  kind: DraftKind,
  folder: "drafts" | "uploaded",
): string => {
  return path.join(AUTHORING_CONTENT_ROOT, kind, folder);
};

const resolveLatestWorkspacePath = async (
  kind: DraftKind,
  folder: "drafts" | "uploaded",
): Promise<{ id: string; path: string } | null> => {
  const root = resolveRoot(kind, folder);

  try {
    const entries = await fs.readdir(root, { withFileTypes: true });

    const ids = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    const latestId = ids.at(-1);

    if (!latestId) {
      return null;
    }

    return {
      id: latestId,
      path: path.join(root, latestId),
    };
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code === "ENOENT") {
      return null;
    }

    throw error;
  }
};

const inspectWorkspace = async (
  kind: DraftKind,
  workspace: { id: string; path: string } | null,
): Promise<WorkspaceStatus | null> => {
  if (!workspace) {
    return null;
  }

  const imagesPath = path.join(workspace.path, "images");

  let imageCount = 0;

  try {
    const imageEntries = await fs.readdir(imagesPath, { withFileTypes: true });
    imageCount = imageEntries.filter((entry) => entry.isFile()).length;
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code !== "ENOENT") {
      throw error;
    }
  }

  const entries = await fs.readdir(workspace.path, { withFileTypes: true });

  const fileNames = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);

  const draftFileCount = fileNames.filter((fileName) =>
    fileName.endsWith(".draft.ts"),
  ).length;

  const hasJournalDraftFile = fileNames.includes("journal.draft.ts");

  return {
    id: workspace.id,
    path: workspace.path,
    exists: true,
    imageCount,
    draftFileCount,
    hasJournalDraftFile: kind === "journal" ? hasJournalDraftFile : false,
  };
};

export const getDraftKindStatus = async (
  kind: DraftKind,
): Promise<DraftKindStatus> => {
  const latestDraft = await inspectWorkspace(
    kind,
    await resolveLatestWorkspacePath(kind, "drafts"),
  );

  const latestUploaded = await inspectWorkspace(
    kind,
    await resolveLatestWorkspacePath(kind, "uploaded"),
  );

  return {
    kind,
    latestDraft,
    latestUploaded,
  };
};
