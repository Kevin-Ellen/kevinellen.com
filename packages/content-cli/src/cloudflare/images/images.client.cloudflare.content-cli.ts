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
    id?: string;
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

const isSuccess = (res: CloudflareImagesUploadResponse, ok: boolean): boolean =>
  ok && res.success && !!res.result?.id;

const isDuplicateError = (res: CloudflareImagesUploadResponse): boolean => {
  const { errors } = res;

  if (!errors || errors.length === 0) return false;

  for (const err of errors) {
    let errString: string;
    try {
      errString = JSON.stringify(err).toLowerCase();
    } catch {
      continue; // skip non-serializable errors
    }

    if (errString.includes("already exists")) {
      return true;
    }
  }

  return false;
};

const getUploadedAt = (provided?: string): string =>
  provided ?? new Date().toISOString();

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

  formData.append("id", metadata.photoId);

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

  if (isSuccess(data, response.ok)) {
    return {
      id: data.result!.id!,
      uploadedAt: getUploadedAt(data.result!.uploaded),
    };
  }

  if (isDuplicateError(data)) {
    console.log(`  ↺ Image already exists, reusing ID: ${metadata.photoId}`);
    return {
      id: metadata.photoId,
      uploadedAt: getUploadedAt(),
    };
  }

  const safeStringify = (obj: unknown): string => {
    try {
      return JSON.stringify(obj);
    } catch {
      return "[unserializable error object]";
    }
  };

  throw new Error(
    `Cloudflare Images upload failed for ${uploadFile.fileName}: ${safeStringify(
      data.errors,
    )}`,
  );
};
