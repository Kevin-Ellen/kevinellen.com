// packages/content-cli/src/content/photo/create.photo.content.ts

import fs from "node:fs/promises";

import type { ContentCommandHandler } from "@content-cli/commands/types/command.types";

import { getPhotoWorkspacePath } from "@content-cli/content/photo/path.photo.content";
import { formatLocalDateTimeWithOffset } from "@content-cli/utils/format.local.date.time.with.offset.util";

const createWorkspaceId = (): string =>
  formatLocalDateTimeWithOffset(new Date()).replace(/:/g, "-");

export const runCreatePhotoCommand: ContentCommandHandler = async () => {
  const workspaceId = createWorkspaceId();

  const workspacePath = getPhotoWorkspacePath("drafts", workspaceId);
  const photosPath = `${workspacePath}/photos`;

  await fs.mkdir(photosPath, { recursive: true });

  console.log("\nPhoto draft workspace created\n");
  console.log(`Workspace: ${workspaceId}`);
  console.log(`Path: ${workspacePath}`);
  console.log(`Photos: ${photosPath}\n`);

  return { ok: true };
};
