// src/tools/authored-content-generator/publish/photo/photo.publish.ts

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";

import type { PhotoAppInit } from "../../../../shared/types/assets/photo.asset.shared.app-init.type";

import { prepareImageForUpload } from "./prepare.photo.publish";

type UploadedImage = Readonly<{
  id: string;
  uploadedAt: string;
}>;

type PhotoPublisher = Readonly<{
  getPhoto: (id: string) => Promise<PhotoAppInit | null>;
  putPhoto: (photo: PhotoAppInit) => Promise<void>;
  uploadImage: (photo: PhotoAppInit, image: Buffer) => Promise<UploadedImage>;
}>;

type Input = Readonly<{
  directory: string;
  photoId: string;
  publisher: PhotoPublisher;
  replaceImage?: boolean;
}>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isUploadedImage = (value: unknown): value is UploadedImage =>
  isRecord(value) &&
  typeof value.id === "string" &&
  value.id.length > 0 &&
  typeof value.uploadedAt === "string" &&
  value.uploadedAt.length > 0;

const readPhotoArtifact = async (
  directory: string,
  photoId: string,
): Promise<PhotoAppInit> => {
  const artifactPath = resolve(
    directory,
    "artifacts",
    `${photoId}.app-init.json`,
  );

  const content = await readFile(artifactPath, "utf8");
  const photoValue: unknown = JSON.parse(content);

  if (
    !isRecord(photoValue) ||
    typeof photoValue.id !== "string" ||
    photoValue.id !== photoId
  ) {
    throw new Error(`Photo artifact ID mismatch: ${photoId}`);
  }

  if (
    typeof photoValue.sourceFileName !== "string" ||
    photoValue.sourceFileName.length === 0
  ) {
    throw new Error(`Invalid photo artifact: ${photoId}`);
  }

  // The content generation and validation pipeline owns the
  // complete PhotoAppInit contract.
  return photoValue as PhotoAppInit;
};

const readUploadCheckpoint = async (
  filePath: string,
): Promise<UploadedImage | null> => {
  let content: string;

  try {
    content = await readFile(filePath, "utf8");
  } catch (error: unknown) {
    if (isRecord(error) && error.code === "ENOENT") {
      return null;
    }

    throw error;
  }

  const checkpoint: unknown = JSON.parse(content);

  if (!isUploadedImage(checkpoint)) {
    throw new Error(`Invalid image upload checkpoint: ${filePath}`);
  }

  return checkpoint;
};

const writeUploadCheckpoint = async (
  filePath: string,
  uploaded: UploadedImage,
): Promise<void> => {
  await writeFile(filePath, `${JSON.stringify(uploaded, null, 2)}\n`, "utf8");
};

export const publishPhoto = async ({
  directory,
  photoId,
  publisher,
  replaceImage = false,
}: Input): Promise<PhotoAppInit> => {
  const photo = await readPhotoArtifact(directory, photoId);

  const existing = await publisher.getPhoto(photo.id);

  const existingUpload: UploadedImage | null =
    existing?.cloudflareImageId && existing.cloudflareUploadedAt
      ? {
          id: existing.cloudflareImageId,
          uploadedAt: existing.cloudflareUploadedAt,
        }
      : photo.cloudflareImageId && photo.cloudflareUploadedAt
        ? {
            id: photo.cloudflareImageId,
            uploadedAt: photo.cloudflareUploadedAt,
          }
        : null;

  const checkpointPath = resolve(
    directory,
    "artifacts",
    `${photo.id}.upload.json`,
  );

  const checkpoint = await readUploadCheckpoint(checkpointPath);

  let uploaded: UploadedImage;

  if (checkpoint) {
    uploaded = checkpoint;

    console.log(`↷ Reusing image upload checkpoint: ${photo.id}`);
  } else if (existingUpload && !replaceImage) {
    uploaded = existingUpload;

    console.log(`↷ Image already uploaded: ${photo.id}`);
  } else {
    const imagePath = resolve(directory, "photos", photo.sourceFileName);

    const image = await prepareImageForUpload(imagePath);

    uploaded = await publisher.uploadImage(photo, image);

    if (!isUploadedImage(uploaded)) {
      throw new Error(`Image upload returned incomplete metadata: ${photo.id}`);
    }

    await writeUploadCheckpoint(checkpointPath, uploaded);

    console.log(`✓ Image uploaded: ${photo.id}`);
  }

  const published: PhotoAppInit = {
    ...photo,
    cloudflareImageId: uploaded.id,
    cloudflareUploadedAt: uploaded.uploadedAt,
  };

  await publisher.putPhoto(published);

  const verified = await publisher.getPhoto(photo.id);

  if (!isDeepStrictEqual(verified, published)) {
    throw new Error(`Photo KV verification failed: ${photo.id}`);
  }

  console.log(`✓ Photo published and verified: ${photo.id}`);

  return published;
};
