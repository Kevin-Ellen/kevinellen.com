// packages/content-cli/src/content/photo/utils/exif.photo.util.content.ts

import sharp from "sharp";
import exifr from "exifr";

export type ExtractedPhotoExif = Readonly<{
  capturedAt: string | null;

  photographer: string | null;
  copyright: string | null;

  cameraMake: string | null;
  cameraModel: string | null;
  lensModel: string | null;

  exposureTime: number | null;
  aperture: number | null;
  iso: number | null;

  focalLength: number | null;
  focalLength35mm: number | null;

  width: number;
  height: number;

  latitude: number | null;
  longitude: number | null;
}>;

const nullableString = (value: unknown): string | null =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : null;

const nullableNumber = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

const nullableIsoDate = (value: unknown): string | null => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  return null;
};

export const extractPhotoExif = async (
  imagePath: string,
): Promise<ExtractedPhotoExif> => {
  const metadata = await sharp(imagePath).metadata();

  const exif = await exifr.parse(imagePath, {
    gps: true,
    mergeOutput: true,
  });

  return {
    capturedAt: nullableIsoDate(exif?.DateTimeOriginal ?? exif?.CreateDate),

    photographer: nullableString(exif?.Artist ?? exif?.Creator),
    copyright: nullableString(exif?.Copyright),

    cameraMake: nullableString(exif?.Make),
    cameraModel: nullableString(exif?.Model),
    lensModel: nullableString(exif?.LensModel),

    exposureTime: nullableNumber(exif?.ExposureTime),
    aperture: nullableNumber(exif?.FNumber),
    iso: nullableNumber(exif?.ISO),

    focalLength: nullableNumber(exif?.FocalLength),
    focalLength35mm: nullableNumber(exif?.FocalLengthIn35mmFormat),

    width: metadata.width ?? 0,
    height: metadata.height ?? 0,

    latitude: nullableNumber(exif?.latitude),
    longitude: nullableNumber(exif?.longitude),
  };
};
