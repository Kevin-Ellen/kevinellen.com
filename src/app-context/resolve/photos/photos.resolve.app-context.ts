// src/app-context/resolve/photos/photos.resolve.app-context.ts

import type { AppContextPhotoMetadata } from "@shared-types/media/photo/app-context.photo.types";
import type { AuthoredPhotoMetadata } from "@shared-types/media/photo/authored.photo.types";

const isAuthoredPhotoCapturedAt = (
  value: unknown,
): value is AuthoredPhotoMetadata["capturedAt"] => {
  if (value === null) {
    return true;
  }

  if (typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<
    NonNullable<AuthoredPhotoMetadata["capturedAt"]>
  >;

  return (
    typeof candidate.utc === "string" &&
    (typeof candidate.timezone === "string" || candidate.timezone === null)
  );
};

const isAuthoredPhotoMetadata = (
  value: unknown,
): value is AuthoredPhotoMetadata => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<AuthoredPhotoMetadata>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.sourceFileName === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.alt === "string" &&
    typeof candidate.commentary === "string" &&
    typeof candidate.readableLocation === "string" &&
    isAuthoredPhotoCapturedAt(candidate.capturedAt) &&
    typeof candidate.width === "number" &&
    typeof candidate.height === "number"
  );
};

const appContextResolvePhoto = (
  photo: AuthoredPhotoMetadata,
): AppContextPhotoMetadata => {
  if (!photo.cloudflareImageId) {
    throw new Error(
      `Photo '${photo.id}' cannot be resolved because cloudflareImageId is missing.`,
    );
  }

  return {
    ...photo,
    cloudflareImageId: photo.cloudflareImageId,
  };
};

export const appContextResolvePhotos = async ({
  kv,
  photoIds,
}: Readonly<{
  kv: KVNamespace;
  photoIds: readonly string[];
}>): Promise<readonly AppContextPhotoMetadata[]> => {
  const uniquePhotoIds = [...new Set(photoIds)];

  return Promise.all(
    uniquePhotoIds.map(async (photoId) => {
      const value = await kv.get(`photo:${photoId}`, "json");

      if (!isAuthoredPhotoMetadata(value)) {
        throw new Error(`Photo '${photoId}' could not be resolved from KV.`);
      }

      return appContextResolvePhoto(value);
    }),
  );
};
