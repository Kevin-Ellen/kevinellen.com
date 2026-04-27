// packages/content-cli/src/cloudflare/images/images.client.cloudflare.content-cli.ts

import type { ContentCliConfig } from "@content-cli/config/load.content-cli.config";
import type { PreparedPhotoUpload } from "@content-cli/content/photo/utils/prepare-upload.photo.util.content";

export type CloudflareImageUploadMetadata = Readonly<{
  photoId: string;
  workspaceId: string;
  creator: string;
}>;

type CloudflareImagesUploadResponse = Readonly<{
  success: boolean;
  errors: readonly unknown[];
  messages: readonly unknown[];
  result?: {
    id: string;
    filename?: string;
    uploaded?: string;
    requireSignedURLs?: boolean;
    variants?: readonly string[];
  };
}>;

export type UploadedCloudflareImage = Readonly<{
  id: string;
  uploadedAt: string;
}>;

export const uploadCloudflareImage = async (
  config: ContentCliConfig,
  uploadFile: PreparedPhotoUpload,
  metadata: CloudflareImageUploadMetadata,
): Promise<UploadedCloudflareImage> => {
  const formData = new FormData();

  formData.append(
    "file",
    new Blob([uploadFile.buffer], { type: uploadFile.mimeType }),
    uploadFile.fileName,
  );

  formData.append(
    "metadata",
    JSON.stringify({
      photoId: metadata.photoId,
      workspaceId: metadata.workspaceId,
      source: "content-cli",
    }),
  );

  formData.append("creator", metadata.creator);

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${config.cloudflareAccountId}/images/v1`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.cloudflareImagesApiToken}`,
      },
      body: formData,
    },
  );

  const data = (await response.json()) as CloudflareImagesUploadResponse;

  if (!response.ok || !data.success || !data.result?.id) {
    throw new Error(
      `Cloudflare Images upload failed for ${uploadFile.fileName}: ${JSON.stringify(
        data.errors,
      )}`,
    );
  }

  return {
    id: data.result.id,
    uploadedAt: data.result.uploaded ?? new Date().toISOString(),
  };
};
