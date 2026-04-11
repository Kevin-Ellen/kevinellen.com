// packages/content-pipeline/src/drafts/helpers/list.draft.workspace.summaries.helper.ts

import fs from "node:fs/promises";
import type { Dirent } from "node:fs";
import path from "node:path";

import type { WorkspaceSummary } from "@content-pipeline/cli/types/workspace.types";
import type { DraftKind } from "@content-pipeline/drafts/types/draft.workspace.types";

const JOURNAL_DRAFT_FILE_NAME = "journal.draft.ts";

const getDraftsDirectory = (kind: DraftKind): string => {
  return path.resolve(process.cwd(), "content-pipeline", kind, "drafts");
};

const getImageCount = async (imagesPath: string): Promise<number> => {
  try {
    const entries = await fs.readdir(imagesPath, { withFileTypes: true });

    return entries.filter((entry) => {
      if (!entry.isFile()) {
        return false;
      }

      const extension = path.extname(entry.name).toLowerCase();

      return [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".tif",
        ".tiff",
        ".avif",
      ].includes(extension);
    }).length;
  } catch {
    return 0;
  }
};

const getDraftFileCount = async (workspacePath: string): Promise<number> => {
  try {
    const entries = await fs.readdir(workspacePath, { withFileTypes: true });

    return entries.filter(
      (entry) => entry.isFile() && entry.name.endsWith(".draft.ts"),
    ).length;
  } catch {
    return 0;
  }
};

const getHasJournalDraftFile = async (
  workspacePath: string,
): Promise<boolean | undefined> => {
  const journalDraftFilePath = path.join(
    workspacePath,
    JOURNAL_DRAFT_FILE_NAME,
  );

  try {
    await fs.access(journalDraftFilePath);
    return true;
  } catch {
    return false;
  }
};

const createWorkspaceSummary = async (
  kind: DraftKind,
  workspacePath: string,
): Promise<WorkspaceSummary> => {
  const id = path.basename(workspacePath);
  const imageCount = await getImageCount(path.join(workspacePath, "images"));
  const draftFileCount = await getDraftFileCount(workspacePath);

  return {
    id,
    path: workspacePath,
    location: "draft",
    imageCount,
    draftFileCount,
    hasJournalDraftFile:
      kind === "journal"
        ? await getHasJournalDraftFile(workspacePath)
        : undefined,
  };
};

export const listDraftWorkspaceSummaries = async (
  kind: DraftKind,
): Promise<WorkspaceSummary[]> => {
  const draftsDirectory = getDraftsDirectory(kind);

  let entries: Dirent[];

  try {
    entries = await fs.readdir(draftsDirectory, { withFileTypes: true });
  } catch {
    return [];
  }

  const workspacePaths = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(draftsDirectory, entry.name))
    .sort((left, right) =>
      path.basename(right).localeCompare(path.basename(left)),
    );

  return Promise.all(
    workspacePaths.map((workspacePath) =>
      createWorkspaceSummary(kind, workspacePath),
    ),
  );
};
