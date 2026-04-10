// packages/content-pipeline/src/photos/helpers/generate.photo.drafts.for.folder.ts

import fs from "node:fs/promises";
import path from "node:path";

import type { PhotoDraftEntry } from "@shared-types/uploads/photo.upload.types";

import { scanImagesFolder } from "@content-pipeline/photos/helpers/scan.images.folder";
import { derivePhotoSlug } from "@content-pipeline/photos/helpers/derive.photo.slug";
import { extractPhotoMetadata } from "@content-pipeline/photos/helpers/extract.photo.metadata";
import { reverseGeocodePhotoLocation } from "@content-pipeline/photos/helpers/reverse.geocode.photo.location";
import { renderPhotoDraftFile } from "@content-pipeline/photos/helpers/render.photo.draft.file";

export type GeneratePhotoDraftsResult = {
  createdCount: number;
  skippedCount: number;
  photoSlugs: string[];
};

export const generatePhotoDraftsForFolder = async (
  draftFolderPath: string,
): Promise<GeneratePhotoDraftsResult> => {
  const imagesFolderPath = path.join(draftFolderPath, "images");

  const imageFilePaths = await scanImagesFolder(imagesFolderPath);

  let createdCount = 0;
  let skippedCount = 0;
  const photoSlugs: string[] = [];

  for (const imageFilePath of imageFilePaths) {
    const sourceFileName = path.basename(imageFilePath);
    const slug = derivePhotoSlug(sourceFileName);
    const draftFilePath = path.join(draftFolderPath, `${slug}.photo.ts`);

    photoSlugs.push(slug);

    try {
      await fs.access(draftFilePath);
      skippedCount += 1;
      continue;
    } catch {
      // file does not exist → continue
    }

    const extractedMetadata = await extractPhotoMetadata(imageFilePath);

    let locationResolved = null;

    if (
      extractedMetadata.latitude !== null &&
      extractedMetadata.longitude !== null
    ) {
      try {
        locationResolved = await reverseGeocodePhotoLocation({
          latitude: extractedMetadata.latitude,
          longitude: extractedMetadata.longitude,
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Unknown reverse geocode error";

        console.warn(
          `Could not resolve location for ${sourceFileName}: ${message}`,
        );
      }
    }

    const photoDraftEntry: PhotoDraftEntry = {
      slug,
      sourceFileName,

      title: "",
      alt: "",
      commentary: "",
      readableLocation: "",

      capturedAt: extractedMetadata.capturedAt,

      photographer: extractedMetadata.photographer,
      copyright: extractedMetadata.copyright,

      cameraMake: extractedMetadata.cameraMake,
      cameraModel: extractedMetadata.cameraModel,
      lensModel: extractedMetadata.lensModel,

      exposureTime: extractedMetadata.exposureTime,
      aperture: extractedMetadata.aperture,
      iso: extractedMetadata.iso,

      focalLength: extractedMetadata.focalLength,
      focalLength35mm: extractedMetadata.focalLength35mm,

      meteringMode: extractedMetadata.meteringMode,
      exposureMode: extractedMetadata.exposureMode,
      whiteBalance: extractedMetadata.whiteBalance,

      width: extractedMetadata.width,
      height: extractedMetadata.height,

      latitude: extractedMetadata.latitude,
      longitude: extractedMetadata.longitude,

      locationResolved,
    };

    const draftFileContent = renderPhotoDraftFile(photoDraftEntry);

    await fs.writeFile(draftFilePath, draftFileContent, "utf8");

    createdCount += 1;
  }

  return {
    createdCount,
    skippedCount,
    photoSlugs,
  };
};
