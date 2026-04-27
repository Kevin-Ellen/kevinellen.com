// packages/content-cli/src/content/photo/validate.photo.content.ts

import fs from "node:fs/promises";
import path from "node:path";

import {
  getPhotoAssetFilePath,
  getPhotoWorkspacePath,
} from "@content-cli/content/photo/path.photo.content";
import { importPhotoDraft } from "@content-cli/content/photo/utils/import.draft.photo.util.content";

import type { ContentCommandHandler } from "@content-cli/commands/types/command.types";

const REQUIRED_PLACEHOLDER = "__REQUIRED__";

const isDraftFile = (fileName: string): boolean =>
  fileName.endsWith(".draft.ts");

export const runValidatePhotoCommand: ContentCommandHandler = async (args) => {
  const workspaceId = args.slug;

  if (!workspaceId) {
    throw new Error("Photo validate requires --slug <workspace-id>.");
  }

  const workspacePath = getPhotoWorkspacePath(args.bucket, workspaceId);
  const entries = await fs.readdir(workspacePath, { withFileTypes: true });

  const draftFiles = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter(isDraftFile)
    .sort();

  console.log("\nValidate photo drafts\n");
  console.log(`Workspace: ${workspaceId}`);
  console.log(`Path: ${workspacePath}\n`);

  if (draftFiles.length === 0) {
    throw new Error("No photo draft files found.");
  }

  let errorCount = 0;

  for (const draftFile of draftFiles) {
    const draftPath = path.join(workspacePath, draftFile);
    const photo = await importPhotoDraft(draftPath);

    const requiredFields = {
      title: photo.title,
      alt: photo.alt,
      commentary: photo.commentary,
      readableLocation: photo.readableLocation,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(
        ([, value]) =>
          value.trim().length === 0 || value === REQUIRED_PLACEHOLDER,
      )
      .map(([field]) => field);

    const sourceImagePath = getPhotoAssetFilePath(
      args.bucket,
      workspaceId,
      photo.sourceFileName,
    );

    try {
      await fs.access(sourceImagePath);
    } catch {
      missingFields.push("sourceFileName image");
    }

    if (photo.width <= 0 || photo.height <= 0) {
      missingFields.push("width/height");
    }

    if (missingFields.length > 0) {
      errorCount += 1;
      console.log(`  ✗ ${draftFile}`);
      console.log(`    Missing/invalid: ${missingFields.join(", ")}`);
      continue;
    }

    console.log(`  ✓ ${draftFile}`);
  }

  console.log();

  if (errorCount > 0) {
    throw new Error(`Photo validation failed for ${errorCount} file(s).`);
  }

  return { ok: true };
};
