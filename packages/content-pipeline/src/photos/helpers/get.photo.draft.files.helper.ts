// packages/content-pipeline/src/photos/helpers/get.photo.draft.files.helper.ts

import fs from "node:fs/promises";
import path from "node:path";

import type { DraftWorkspace } from "@content-pipeline/drafts/types/draft.workspace.types";

export const getPhotoDraftFiles = async (
  workspace: DraftWorkspace,
): Promise<string[]> => {
  const entries = await fs.readdir(workspace.draftPath, {
    withFileTypes: true,
  });

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter(
      (fileName) =>
        fileName.endsWith(".draft.ts") && fileName !== "journal.draft.ts",
    )
    .sort()
    .map((fileName) => path.join(workspace.draftPath, fileName));
};
