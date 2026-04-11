import path from "node:path";

import { extractImageMetadata } from "@content-pipeline/media/helpers/extract.image.metadata.helper";
import { reverseGeocodeImageLocation } from "@content-pipeline/media/helpers/reverse.geocode.image.location.helper";

import type { ResolvedImageMetadata } from "@content-pipeline/media/types/resolved.image.metadata.types";

export const resolveImageMetadata = async (
  imageFilePath: string,
): Promise<ResolvedImageMetadata> => {
  const metadata = await extractImageMetadata(imageFilePath);

  const locationResolved =
    metadata.latitude !== null && metadata.longitude !== null
      ? await reverseGeocodeImageLocation({
          latitude: metadata.latitude,
          longitude: metadata.longitude,
        })
      : null;

  return {
    sourceFileName: path.basename(imageFilePath),

    capturedAt: metadata.capturedAt,

    photographer: metadata.photographer,
    copyright: metadata.copyright,

    cameraMake: metadata.cameraMake,
    cameraModel: metadata.cameraModel,
    lensModel: metadata.lensModel,

    exposureTime: metadata.exposureTime,
    aperture: metadata.aperture,
    iso: metadata.iso,

    focalLength: metadata.focalLength,
    focalLength35mm: metadata.focalLength35mm,

    meteringMode: metadata.meteringMode,
    exposureMode: metadata.exposureMode,
    whiteBalance: metadata.whiteBalance,

    width: metadata.width,
    height: metadata.height,

    latitude: metadata.latitude,
    longitude: metadata.longitude,

    locationResolved,
  };
};
