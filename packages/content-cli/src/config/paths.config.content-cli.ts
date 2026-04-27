// packages/content-cli/src/config/paths.config.content-cli.ts

import path from "node:path";

export const CONTENT_WORKSPACE_ROOT = path.resolve(
  process.cwd(),
  "content-pipeline",
);

export const JOURNAL_WORKSPACE_ROOT = path.join(
  CONTENT_WORKSPACE_ROOT,
  "journal",
);

export const PHOTO_WORKSPACE_ROOT = path.join(CONTENT_WORKSPACE_ROOT, "photo");
