// packages/content-cli/src/content/photo/publish.photo.content.ts

import fs from "node:fs/promises";
import path from "node:path";

import { loadContentCliConfig } from "@content-cli/config/load.content-cli.config";
import {
  getPhotoAssetDirectoryPath,
  getPhotoMetadataFilePath,
  getPhotoWorkspacePath,
} from "@content-cli/content/photo/path.photo.content";
import { renderPhotoDraftFile } from "@content-cli/content/photo/render.photo.content";
import { publishPhotoDrafts } from "@content-cli/content/shared/publish-drafts.photo.content";

import type { ContentCommandHandler } from "@content-cli/commands/types/command.types";

export const runPublishPhotoCommand: ContentCommandHandler = async (args) => {
  const workspaceId = args.slug;

  if (!workspaceId) {
    throw new Error("Photo publish requires --slug <workspace-id>.");
  }

  const config = loadContentCliConfig(args.env);

  const workspacePath = getPhotoWorkspacePath(args.bucket, workspaceId);
  const photosPath = getPhotoAssetDirectoryPath(args.bucket, workspaceId);
  const uploadedWorkspacePath = getPhotoWorkspacePath("uploaded", workspaceId);

  console.log("\nPublish photo drafts\n");
  console.log(`Workspace: ${workspaceId}`);
  console.log(`Path: ${workspacePath}\n`);

  const publishedPhotos = await publishPhotoDrafts(
    config,
    workspaceId,
    workspacePath,
    photosPath,
  );

  if (publishedPhotos.length === 0) {
    throw new Error("No photo draft files found.");
  }

  await fs.rm(uploadedWorkspacePath, {
    recursive: true,
    force: true,
  });

  await fs.mkdir(path.dirname(uploadedWorkspacePath), {
    recursive: true,
  });

  await fs.rename(workspacePath, uploadedWorkspacePath);

  for (const publishedPhoto of publishedPhotos) {
    const uploadedPath = getPhotoMetadataFilePath(
      "uploaded",
      workspaceId,
      publishedPhoto.id,
    );

    const draftPath = path.join(
      uploadedWorkspacePath,
      `${publishedPhoto.id}.draft.ts`,
    );

    await fs.rm(draftPath, { force: true });

    await fs.writeFile(
      uploadedPath,
      renderPhotoDraftFile(publishedPhoto),
      "utf8",
    );

    console.log(`Saved: ${uploadedPath}`);
  }

  console.log(`\nWorkspace moved:`);
  console.log(`  ${workspacePath}`);
  console.log(`  → ${uploadedWorkspacePath}\n`);

  return { ok: true };
};
