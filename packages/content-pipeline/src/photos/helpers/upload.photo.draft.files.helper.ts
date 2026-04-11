// packages/content-pipeline/src/photos/helpers/upload.photo.draft.files.helper.ts

import type { ContentPipelineEnvironment } from "@content-pipeline/config/types/content.pipeline.environment.types";
import type { DraftWorkspace } from "@content-pipeline/drafts/types/draft.workspace.types";

import { loadContentPipelineConfig } from "@content-pipeline/config/load.content.pipeline.env";
import { prepareCloudflareUploadImage } from "@content-pipeline/media/helpers/prepare.cloudflare.upload.image.helper";
import { putCloudflareKvJson } from "@content-pipeline/media/helpers/put.cloudflare.kv.json.helper";
import { uploadCloudflareImage } from "@content-pipeline/media/helpers/upload.cloudflare.image.helper";
import { createPhotoKvRecord } from "@content-pipeline/photos/helpers/create.photo.kv.record.helper";
import { getPhotoDraftFiles } from "@content-pipeline/photos/helpers/get.photo.draft.files.helper";
import { normalisePhotoDraft } from "@content-pipeline/photos/helpers/normalise.photo.draft.helper";
import { readPhotoDraft } from "@content-pipeline/photos/helpers/read.photo.draft.helper";
import { resolvePhotoSourceImagePath } from "@content-pipeline/photos/helpers/resolve.photo.source.image.path.helper";

export type UploadedPhotoDraftFile = {
  draftFilePath: string;
  photoId: string;
  cloudflareImageId: string;
  kvKey: string;
  uploadFileName: string;
  size: number;
};

const getPhotoKvKey = (photoId: string): string => {
  return `photo:${photoId}`;
};

export const uploadPhotoDraftFiles = async ({
  env,
  workspace,
}: {
  env: ContentPipelineEnvironment;
  workspace: DraftWorkspace;
}): Promise<UploadedPhotoDraftFile[]> => {
  const config = loadContentPipelineConfig(env);

  const draftFilePaths = await getPhotoDraftFiles(workspace);

  if (draftFilePaths.length === 0) {
    return [];
  }

  const uploadedPhotoDraftFiles: UploadedPhotoDraftFile[] = [];

  for (const draftFilePath of draftFilePaths) {
    const photoDraft = await readPhotoDraft(draftFilePath);
    const photoEntry = normalisePhotoDraft(photoDraft);

    const sourceImagePath = await resolvePhotoSourceImagePath(
      workspace,
      photoDraft,
    );

    const preparedImage = await prepareCloudflareUploadImage({
      imageFilePath: sourceImagePath,
      copyright: photoEntry.copyright,
      photographer: photoEntry.photographer,
    });

    const uploadedImage = await uploadCloudflareImage({
      accountId: config.cloudflareAccountId,
      apiToken: config.cloudflareImagesApiToken,
      imageId: photoEntry.id,
      creator: photoEntry.photographer,
      metadata: {
        photoId: photoEntry.id,
      },
      fileName: preparedImage.fileName,
      mimeType: preparedImage.mimeType,
      buffer: preparedImage.buffer,
    });

    const photoKvRecord = createPhotoKvRecord(photoEntry, uploadedImage);
    const kvKey = getPhotoKvKey(photoEntry.id);

    await putCloudflareKvJson({
      accountId: config.cloudflareAccountId,
      apiToken: config.cloudflareKvApiToken,
      namespaceId: config.cloudflareKvPhotosNamespaceId,
      key: kvKey,
      value: photoKvRecord,
    });

    uploadedPhotoDraftFiles.push({
      draftFilePath,
      photoId: photoEntry.id,
      cloudflareImageId: uploadedImage.id,
      kvKey,
      uploadFileName: preparedImage.fileName,
      size: preparedImage.size,
    });
  }

  return uploadedPhotoDraftFiles;
};
