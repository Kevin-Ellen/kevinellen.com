// packages/content-pipeline/src/cli/commands/photo/upload.photo.command.ts

import path from "node:path";

import type { PhotoDraftEntry } from "@shared-types/uploads/photo.upload.types";

import type { ContentPipelineEnvironment } from "@content-pipeline/config/content.pipeline.environment.types";
import { loadContentPipelineEnv } from "@content-pipeline/config/load.content.pipeline.env";
import { writeCloudflareKv } from "@content-pipeline/photos/clients/write.cloudflare.kv";
import { uploadCloudflareImage } from "@content-pipeline/photos/clients/upload.cloudflare.image";
import { archiveUploadedPhotoDraft } from "@content-pipeline/photos/helpers/archive.uploaded.photo.draft";
import { loadPhotoDrafts } from "@content-pipeline/photos/helpers/load.photo.draft";
import { prepareCloudflareUploadImage } from "@content-pipeline/photos/helpers/prepare.cloudflare.upload.image";
import { validatePhotoDrafts } from "@content-pipeline/photos/helpers/validate.photo.draft";

type PublishedPhotoRecord = PhotoDraftEntry & {
  image: {
    id: string;
    filename: string | null;
    uploadedAt: string | null;
    variants: string[];
  };
};

const buildPublishedPhotoRecord = (
  photo: PhotoDraftEntry,
  uploadedImage: PublishedPhotoRecord["image"],
): PublishedPhotoRecord => {
  return {
    ...photo,
    image: uploadedImage,
  };
};

export const runUploadPhotoCommand = async (
  environment: ContentPipelineEnvironment,
): Promise<void> => {
  const env = loadContentPipelineEnv();

  const { draftFolderPath, drafts } = await loadPhotoDrafts();

  const { validated } = await validatePhotoDrafts({
    draftFolderPath,
    drafts,
  });

  let uploadedCount = 0;

  for (const draft of validated) {
    const { fileName, photo } = draft;

    const imageFilePath = path.join(
      draftFolderPath,
      "images",
      photo.sourceFileName,
    );

    try {
      await prepareCloudflareUploadImage(imageFilePath);

      const uploadedImage = await uploadCloudflareImage({
        accountId: env.cloudflareAccountId,
        apiToken: env.cloudflareImagesApiToken,
        imageFilePath,
        imageId: photo.slug,
        creator: photo.photographer,
        metadata: {
          slug: photo.slug,
          type: "photo",
          ...(photo.capturedAt !== null
            ? { capturedAt: photo.capturedAt }
            : {}),
        },
      });

      const publishedPhotoRecord = buildPublishedPhotoRecord(photo, {
        id: uploadedImage.id,
        filename: uploadedImage.filename,
        uploadedAt: uploadedImage.uploaded,
        variants: uploadedImage.variants,
      });

      await writeCloudflareKv({
        accountId: env.cloudflareAccountId,
        apiToken: env.cloudflareKvApiToken,
        namespaceId: env.cloudflareKvPhotosNamespaceId,
        key: `photo:${photo.slug}`,
        value: publishedPhotoRecord,
      });

      uploadedCount += 1;

      console.log(`Uploaded photo: ${fileName} → ${photo.slug}`);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown upload error";

      throw new Error(`Failed to upload photo "${fileName}": ${message}`, {
        cause: error,
      });
    }
  }

  const archivedDraftPath = await archiveUploadedPhotoDraft(
    draftFolderPath,
    environment,
  );

  console.log("\nPhoto upload complete");
  console.log(`→ Environment: ${environment}`);
  console.log(`→ Uploaded: ${uploadedCount}`);
  console.log(`→ Archived draft: ${archivedDraftPath}\n`);
};
