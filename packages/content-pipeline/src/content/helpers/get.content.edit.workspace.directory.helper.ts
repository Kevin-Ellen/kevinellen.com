// packages/content-pipeline/src/content/helpers/get.content.edit.workspace.directory.helper.ts

import path from "node:path";

import { getContentEditsDirectory } from "@content-pipeline/content/helpers/get.content.edits.directory.helper";

import type { ContentCliEntity } from "@content-pipeline/cli/types/cli.types";

export const getContentEditWorkspaceDirectory = (
  kind: Extract<ContentCliEntity, "journal" | "article">,
  id: string,
): string => {
  return path.join(getContentEditsDirectory(kind), id);
};
