// packages/content-pipeline/src/cli/commands/photo/upload.photo.command.ts

import path from "node:path";

import type { ContentCommandOptions } from "@content-pipeline/cli/types/command.options.types";

import { resolveDraftWorkspaceById } from "@content-pipeline/drafts/helpers/resolve.draft.workspace.by.id.helper";
import { resolveLatestDraftWorkspace } from "@content-pipeline/drafts/helpers/resolve.latest.draft.workspace.helper";
import { uploadPhotoDraftFiles } from "@content-pipeline/photos/helpers/upload.photo.draft.files.helper";
import { moveDraftWorkspaceToUploaded } from "@content-pipeline/drafts/helpers/move.draft.workspace.to.uploaded.helper";

const resolvePhotoWorkspace = async (options: ContentCommandOptions) => {
  if (options.draftId) {
    return resolveDraftWorkspaceById("photo", options.draftId);
  }

  return resolveLatestDraftWorkspace("photo");
};

export const runUploadPhotoCommand = async (
  options: ContentCommandOptions,
): Promise<void> => {
  const workspace = await resolvePhotoWorkspace(options);

  const uploadedPhotoDraftFiles = await uploadPhotoDraftFiles({
    env: options.env,
    workspace,
  });

  if (uploadedPhotoDraftFiles.length === 0) {
    throw new Error(`No photo draft files found in: ${workspace.draftPath}`);
  }

  for (const uploadedPhotoDraftFile of uploadedPhotoDraftFiles) {
    console.log(
      `Uploaded: ${path.basename(uploadedPhotoDraftFile.draftFilePath)}`,
    );
    console.log(`- photo id: ${uploadedPhotoDraftFile.photoId}`);
    console.log(
      `- cloudflare image id: ${uploadedPhotoDraftFile.cloudflareImageId}`,
    );
    console.log(`- kv key: ${uploadedPhotoDraftFile.kvKey}`);
    console.log(`- upload file: ${uploadedPhotoDraftFile.uploadFileName}`);
    console.log(`- size: ${uploadedPhotoDraftFile.size} bytes\n`);
  }

  const uploadedWorkspacePath = await moveDraftWorkspaceToUploaded(workspace);

  console.log("Photo uploads complete");
  console.log(`- draft: ${workspace.draftId}`);
  console.log(`- total drafts uploaded: ${uploadedPhotoDraftFiles.length}`);
  console.log(`- moved to: ${uploadedWorkspacePath}\n`);
};
