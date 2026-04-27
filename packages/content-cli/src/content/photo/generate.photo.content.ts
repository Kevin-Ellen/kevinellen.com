// packages/content-cli/src/content/photo/generate.photo.content.ts

import {
  getPhotoAssetDirectoryPath,
  getPhotoWorkspacePath,
} from "@content-cli/content/photo/path.photo.content";
import { generatePhotoDrafts } from "@content-cli/content/shared/generate-drafts.photo.content";

import type { ContentCommandHandler } from "@content-cli/commands/types/command.types";

export const runGeneratePhotoCommand: ContentCommandHandler = async (args) => {
  const workspaceId = args.slug;

  if (!workspaceId) {
    throw new Error("Photo generate requires --slug <workspace-id>.");
  }

  const workspacePath = getPhotoWorkspacePath(args.bucket, workspaceId);
  const photosPath = getPhotoAssetDirectoryPath(args.bucket, workspaceId);

  console.log("\nGenerate photo drafts\n");
  console.log(`Workspace: ${workspaceId}`);
  console.log(`Photos: ${photosPath}\n`);

  const photos = await generatePhotoDrafts(
    args.bucket,
    workspaceId,
    workspacePath,
    photosPath,
  );

  if (photos.length === 0) {
    console.log("No supported image files found.\n");
    return { ok: true };
  }

  for (const photo of photos) {
    console.log(`  ✓ ${photo.sourceFileName}`);
    console.log(`    → ${photo.id}.draft.ts`);
  }

  console.log();

  return { ok: true };
};
