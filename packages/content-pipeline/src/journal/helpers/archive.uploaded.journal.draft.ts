// packages/content-pipeline/src/journal/helpers/archive.uploaded.journal.draft.ts

import fs from "node:fs/promises";
import path from "node:path";

import type { ContentPipelineEnvironment } from "@content-pipeline/cli/config/environment.cli.types";

export const archiveUploadedJournalDraft = async (
  draftFolderPath: string,
  environment: ContentPipelineEnvironment,
): Promise<string> => {
  const archiveRoot = path.resolve(
    process.cwd(),
    "content-pipeline",
    "journal",
    "uploaded",
    environment,
  );

  await fs.mkdir(archiveRoot, { recursive: true });

  const archivedDraftPath = path.join(
    archiveRoot,
    path.basename(draftFolderPath),
  );

  await fs.rename(draftFolderPath, archivedDraftPath);

  return archivedDraftPath;
};
