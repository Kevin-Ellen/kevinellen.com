// packages/content-cli/src/content/notes/path.note.content.ts

import path from "node:path";

import { NOTE_WORKSPACE_ROOT } from "@content-cli/config/paths.config.content-cli";

import type { ContentCliEnvironment } from "@content-cli/types/content-cli.env.types";
import type { ContentWorkspaceBucket } from "@content-cli/types/workspace.content-cli.types";

const NOTE_FILE_NAMES: Readonly<Record<ContentWorkspaceBucket, string>> = {
  drafts: "note.draft.ts",
  edits: "note.edit.ts",
  uploaded: "note.uploaded.ts",
};

export const getNoteBucketPath = (
  env: ContentCliEnvironment,
  bucket: ContentWorkspaceBucket,
): string => path.join(NOTE_WORKSPACE_ROOT, bucket, env);

export const getNoteWorkspacePath = (
  env: ContentCliEnvironment,
  bucket: ContentWorkspaceBucket,
  workspaceId: string,
): string => path.join(getNoteBucketPath(env, bucket), workspaceId);

export const getNoteFilePath = (
  env: ContentCliEnvironment,
  bucket: ContentWorkspaceBucket,
  workspaceId: string,
): string =>
  path.join(
    getNoteWorkspacePath(env, bucket, workspaceId),
    NOTE_FILE_NAMES[bucket],
  );
