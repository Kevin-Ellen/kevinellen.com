// packages/content-cli/src/content/journal/path.journal.content.ts

import path from "node:path";

import { JOURNAL_WORKSPACE_ROOT } from "@content-cli/config/paths.config.content-cli";

import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";
import type { ContentWorkspaceBucket } from "@content-cli/types/workspace.content-cli.types";

const JOURNAL_FILE_NAMES: Readonly<Record<ContentWorkspaceBucket, string>> = {
  drafts: "journal.draft.ts",
  edits: "journal.edit.ts",
  uploaded: "journal.uploaded.ts",
};

export const getJournalBucketPath = (
  env: ContentCliEnvironment,
  bucket: ContentWorkspaceBucket,
): string => path.join(JOURNAL_WORKSPACE_ROOT, bucket, env);

export const getJournalWorkspacePath = (
  env: ContentCliEnvironment,
  bucket: ContentWorkspaceBucket,
  workspaceId: string,
): string => path.join(getJournalBucketPath(env, bucket), workspaceId);

export const getJournalFilePath = (
  env: ContentCliEnvironment,
  bucket: ContentWorkspaceBucket,
  workspaceId: string,
): string =>
  path.join(
    getJournalWorkspacePath(env, bucket, workspaceId),
    JOURNAL_FILE_NAMES[bucket],
  );
