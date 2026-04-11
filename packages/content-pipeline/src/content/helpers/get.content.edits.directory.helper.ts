// packages/content-pipeline/src/content/helpers/get.content.edits.directory.helper.ts

import path from "node:path";

import type { ContentCliEntity } from "@content-pipeline/cli/types/cli.types";

export const getContentEditsDirectory = (
  kind: Extract<ContentCliEntity, "journal" | "article">,
): string => {
  return path.resolve(process.cwd(), "content-pipeline", kind, "edits");
};
