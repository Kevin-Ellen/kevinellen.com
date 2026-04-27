// packages/content-pipeline/src/cli/commands/photo/create.photo.command.ts

import path from "node:path";

import type { ContentCommandResult } from "@content-pipeline/cli/types/command.definition.types";
import type { ContentCommandOptions } from "@content-pipeline/cli/types/command.options.types";

import { resolveDraftWorkspaceById } from "@content-pipeline/drafts/helpers/resolve.draft.workspace.by.id.helper";
import { resolveLatestDraftWorkspace } from "@content-pipeline/drafts/helpers/resolve.latest.draft.workspace.helper";
import { createPhotoDraftFiles } from "@content-pipeline/media/helpers/create.photo.draft.files.helper";
import { getDraftImageFiles } from "@content-pipeline/media/helpers/get.draft.image.files.helper";

const resolvePhotoWorkspace = async (options: ContentCommandOptions) => {
  if (options.draftId) {
    return resolveDraftWorkspaceById("photo", options.draftId);
  }

  return resolveLatestDraftWorkspace("photo");
};

export const runCreatePhotoCommand = async (
  options: ContentCommandOptions,
): Promise<ContentCommandResult> => {
  const workspace = await resolvePhotoWorkspace(options);

  const imageFiles = await getDraftImageFiles(workspace);

  if (imageFiles.length === 0) {
    throw new Error(`No image files found in: ${workspace.imagesPath}`);
  }

  const createdDraftFiles = await createPhotoDraftFiles(
    workspace.draftPath,
    imageFiles,
  );

  for (const createdDraftFile of createdDraftFiles) {
    console.log(`Created: ${createdDraftFile.draftFileName}`);
    console.log(
      `- source image: ${path.basename(createdDraftFile.imageFilePath)}`,
    );
    console.log(`- id: ${createdDraftFile.entry.id}`);
    console.log(`- capturedAt: ${createdDraftFile.entry.capturedAt ?? "null"}`);
    console.log(`- camera: ${createdDraftFile.entry.cameraModel ?? "null"}`);
    console.log(
      `- location: ${createdDraftFile.entry.locationResolved?.displayName ?? "null"}\n`,
    );
  }

  console.log("Photo draft files created");
  console.log(`→ ${workspace.draftPath}`);
  console.log(`- draft: ${workspace.draftId}`);
  console.log(`- total: ${createdDraftFiles.length}`);
  console.log("\nNext steps:");
  console.log("1. Open the draft folder");
  console.log(`   code ${workspace.draftPath}`);
  console.log("2. Fill in title, alt, commentary, and any adjustments");
  console.log("3. Run the upload command when ready\n");

  return {
    workspace,
  };
};
