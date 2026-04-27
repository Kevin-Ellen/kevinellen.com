// packages/content-cli/src/content/photo/workspace.status.photo.content.ts

import fs from "node:fs/promises";
import path from "node:path";

import { PHOTO_WORKSPACE_ROOT } from "@content-cli/config/paths.config.content-cli";

import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";
import type { ContentWorkspaceBucket } from "@content-cli/types/workspace.content-cli.types";

type PhotoWorkspaceStatusBucket = Readonly<{
  bucket: ContentWorkspaceBucket;
  env: ContentCliEnvironment;
  path: string;
  count: number;
  workspaceIds: readonly string[];
}>;

const getWorkspaceIds = async (directoryPath: string): Promise<string[]> => {
  try {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
  } catch {
    return [];
  }
};

export const getPhotoWorkspaceStatus = async (
  env: ContentCliEnvironment,
): Promise<readonly PhotoWorkspaceStatusBucket[]> => {
  const buckets: readonly ContentWorkspaceBucket[] = [
    "drafts",
    "edits",
    "uploaded",
  ];

  return Promise.all(
    buckets.map(async (bucket) => {
      const directoryPath = path.join(PHOTO_WORKSPACE_ROOT, bucket);
      const workspaceIds = await getWorkspaceIds(directoryPath);

      return {
        bucket,
        env,
        path: directoryPath,
        count: workspaceIds.length,
        workspaceIds,
      };
    }),
  );
};
