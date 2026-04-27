// packages/content-cli/src/content/shared/generate-drafts.photo.content.ts

import fs from "node:fs/promises";
import path from "node:path";

import { getPhotoMetadataFilePath } from "@content-cli/content/photo/path.photo.content";
import { createDraftPhotoMetadata } from "@content-cli/content/photo/draft.create.photo.content";
import { renderPhotoDraftFile } from "@content-cli/content/photo/render.photo.content";
import { extractPhotoExif } from "@content-cli/content/photo/utils/exif.photo.util.content";
import { resolvePhotoLocation } from "@content-cli/content/photo/utils/location.photo.util.content";

import type { AuthoredPhotoMetadata } from "@shared-types/media/photo/authored.photo.types";
import type { ContentWorkspaceBucket } from "@content-cli/types/workspace.content-cli.types";

const SUPPORTED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

const isSupportedImageFile = (fileName: string): boolean =>
  SUPPORTED_IMAGE_EXTENSIONS.some((extension) =>
    fileName.toLowerCase().endsWith(extension),
  );

export const generatePhotoDrafts = async (
  bucket: ContentWorkspaceBucket,
  workspaceId: string,
  workspacePath: string,
  photosPath: string,
): Promise<readonly AuthoredPhotoMetadata[]> => {
  const entries = await fs.readdir(photosPath, { withFileTypes: true });

  const imageFiles = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter(isSupportedImageFile)
    .sort();

  const generatedPhotos: AuthoredPhotoMetadata[] = [];

  for (const imageFile of imageFiles) {
    const imagePath = path.join(photosPath, imageFile);
    const exif = await extractPhotoExif(imagePath);

    const resolvedLocation = await resolvePhotoLocation(
      exif.latitude,
      exif.longitude,
    );

    const photo = createDraftPhotoMetadata(imageFile, exif, resolvedLocation);

    const draftPath = path.join(
      workspacePath,
      path.basename(getPhotoMetadataFilePath(bucket, workspaceId, photo.id)),
    );

    await fs.writeFile(draftPath, renderPhotoDraftFile(photo), "utf8");

    generatedPhotos.push(photo);
  }

  return generatedPhotos;
};
