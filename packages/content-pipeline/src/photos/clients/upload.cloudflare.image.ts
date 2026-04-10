// packages/content-pipeline/src/photos/clients/upload.cloudflare.image.ts

import fs from "node:fs/promises";
import path from "node:path";

import type {
  CloudflareImageUploadResponse,
  CloudflareImageUploadResult,
} from "../types/cloudflare.images.types";

type UploadCloudflareImageInput = {
  accountId: string;
  apiToken: string;
  imageFilePath: string;
  imageId: string;
  creator: string | null;
  metadata: Record<string, string> | null;
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
  imageFilePath,
  imageId,
  creator,
  metadata,
}: UploadCloudflareImageInput): Promise<CloudflareImageUploadResult> => {
  const imageBuffer = await fs.readFile(imageFilePath);
  const fileName = path.basename(imageFilePath);

  const formData = new FormData();

  formData.set("file", new Blob([imageBuffer]), fileName);
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
