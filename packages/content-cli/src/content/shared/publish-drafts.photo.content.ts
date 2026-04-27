// packages/content-cli/src/content/shared/publish-drafts.photo.content.ts

import fs from "node:fs/promises";
import path from "node:path";

import type { ContentCliConfig } from "@content-cli/config/load.content-cli.config";
import type { AuthoredPhotoMetadata } from "@shared-types/media/photo/authored.photo.types";

import { writeCloudflareKvValue } from "@content-cli/cloudflare/kv/kv.client.cloudflare.content-cli";
import { uploadCloudflareImage } from "@content-cli/cloudflare/images/images.client.cloudflare.content-cli";
import { importPhotoDraft } from "@content-cli/content/photo/utils/import.draft.photo.util.content";
import { preparePhotoUploadFile } from "@content-cli/content/photo/utils/prepare-upload.photo.util.content";

const isDraftFile = (fileName: string): boolean =>
  fileName.endsWith(".draft.ts") && fileName !== "journal.draft.ts";

export const publishPhotoDrafts = async (
  config: ContentCliConfig,
  workspaceId: string,
  workspacePath: string,
  photosPath: string,
): Promise<readonly AuthoredPhotoMetadata[]> => {
  const entries = await fs.readdir(workspacePath, { withFileTypes: true });

  const draftFiles = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter(isDraftFile)
    .sort();

  const publishedPhotos: AuthoredPhotoMetadata[] = [];

  for (const draftFile of draftFiles) {
    const draftPath = path.join(workspacePath, draftFile);
    const photo = await importPhotoDraft(draftPath);

    const imagePath = path.join(photosPath, photo.sourceFileName);
    const uploadFile = await preparePhotoUploadFile(imagePath);

    console.log(`Uploading ${photo.sourceFileName}...`);

    const uploadedImage = await uploadCloudflareImage(config, uploadFile, {
      photoId: photo.id,
      workspaceId,
      creator: photo.photographer ?? "Kevin Ellen",
    });

    const publishedPhoto: AuthoredPhotoMetadata = {
      ...photo,
      cloudflareImageId: uploadedImage.id,
      cloudflareUploadedAt: uploadedImage.uploadedAt,
    };

    await writeCloudflareKvValue(
      config,
      config.cloudflareKvPhotosNamespaceId,
      `photo:${publishedPhoto.id}`,
      publishedPhoto,
    );

    publishedPhotos.push(publishedPhoto);

    console.log(`  ✓ ${photo.id}`);
    console.log(`    Cloudflare Image ID: ${uploadedImage.id}`);
    console.log(`    KV: photo:${publishedPhoto.id}\n`);
  }

  return publishedPhotos;
};
