// packages/content-pipeline/src/photos/helpers/archive.uploaded.photo.draft.ts

import fs from "node:fs/promises";
import path from "node:path";

import type { ContentPipelineEnvironment } from "@content-pipeline/config/content.pipeline.environment.types";

export const archiveUploadedPhotoDraft = async (
  draftFolderPath: string,
  environment: ContentPipelineEnvironment,
): Promise<string> => {
  const folderName = path.basename(draftFolderPath);

  const targetRoot = path.resolve(
    process.cwd(),
    "content-pipeline",
    "photos",
    "uploaded",
    environment,
  );

  await fs.mkdir(targetRoot, { recursive: true });

  const targetPath = path.join(targetRoot, folderName);

  await fs.rename(draftFolderPath, targetPath);

  return targetPath;
};
