// packages/content-cli/src/content/journal/workspace.status.journal.content.ts

import fs from "node:fs/promises";
import path from "node:path";

import { JOURNAL_WORKSPACE_ROOT } from "@content-cli/config/paths.config.content-cli";

import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";
import type { ContentWorkspaceBucket } from "@content-cli/types/workspace.content-cli.types";

type JournalWorkspaceStatusBucket = Readonly<{
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

export const getJournalWorkspaceStatus = async (
  env: ContentCliEnvironment,
): Promise<readonly JournalWorkspaceStatusBucket[]> => {
  const buckets: readonly ContentWorkspaceBucket[] = [
    "drafts",
    "edits",
    "uploaded",
  ];

  return Promise.all(
    buckets.map(async (bucket) => {
      const directoryPath = path.join(JOURNAL_WORKSPACE_ROOT, bucket, env);
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
