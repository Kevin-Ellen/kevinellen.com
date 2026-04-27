// packages/content-cli/src/content/journal/path.journal.content.ts

import path from "node:path";

import { JOURNAL_WORKSPACE_ROOT } from "@content-cli/config/paths.config.content-cli";

import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";
import type { ContentWorkspaceBucket } from "@content-cli/types/workspace.content-cli.types";

export const getJournalBucketPath = (
  env: ContentCliEnvironment,
  bucket: ContentWorkspaceBucket,
): string => path.join(JOURNAL_WORKSPACE_ROOT, bucket, env);

export const getJournalWorkspacePath = (
  env: ContentCliEnvironment,
  bucket: ContentWorkspaceBucket,
  workspaceId: string,
): string => path.join(getJournalBucketPath(env, bucket), workspaceId);

const getJournalFileName = (bucket: ContentWorkspaceBucket): string => {
  if (bucket === "drafts") {
    return "journal.draft.ts";
  }

  if (bucket === "edits") {
    return "journal.edit.ts";
  }

  return "journal.uploaded.ts";
};

export const getJournalFilePath = (
  env: ContentCliEnvironment,
  bucket: ContentWorkspaceBucket,
  workspaceId: string,
): string =>
  path.join(
    getJournalWorkspacePath(env, bucket, workspaceId),
    getJournalFileName(bucket),
  );
