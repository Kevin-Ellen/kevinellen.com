// packages/content-pipeline/src/media/helpers/upload.cloudflare.image.helper.ts

import type {
  CloudflareImageUploadResponse,
  CloudflareImageUploadResult,
} from "@content-pipeline/media/types/cloudflare.images.types";

export type UploadCloudflareImageInput = {
  accountId: string;
  apiToken: string;
  imageId: string;
  creator: string | null;
  metadata: Record<string, string> | null;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
};

const CLOUDFLARE_IMAGES_UPLOAD_URL = (accountId: string): string =>
  `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`;

const isCloudflareImageUploadSuccess = (
  value: CloudflareImageUploadResponse,
): value is {
  success: true;
  errors: [];
  messages: unknown[];
  result: CloudflareImageUploadResult;
} => {
  return value.success === true;
};

export const uploadCloudflareImage = async ({
  accountId,
  apiToken,
  imageId,
  creator,
  metadata,
  fileName,
  mimeType,
  buffer,
}: UploadCloudflareImageInput): Promise<CloudflareImageUploadResult> => {
  const formData = new FormData();

  const fileBytes = Uint8Array.from(buffer);
  const fileBlob = new Blob([fileBytes.buffer], { type: mimeType });

  formData.set("file", fileBlob, fileName);
  formData.set("id", imageId);

  if (creator !== null) {
    formData.set("creator", creator);
  }

  if (metadata !== null) {
    formData.set("metadata", JSON.stringify(metadata));
  }

  const response = await fetch(CLOUDFLARE_IMAGES_UPLOAD_URL(accountId), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(
      `Cloudflare Images upload failed with status ${response.status}: ${responseText}`,
    );
  }

  const json = (await response.json()) as CloudflareImageUploadResponse;

  if (!isCloudflareImageUploadSuccess(json)) {
    const message =
      json.errors
        .map((error) => error.message)
        .filter((value): value is string => typeof value === "string")
        .join("; ") || "Unknown Cloudflare Images API error";

    throw new Error(`Cloudflare Images upload failed: ${message}`);
  }

  return {
    id: json.result.id,
    filename: json.result.filename,
    uploaded: json.result.uploaded,
    variants: json.result.variants,
  };
};
