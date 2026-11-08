// src/tools/authored-content-generator/prepare/photo/exif/exif.photo.prepare.ts

import { readFile } from "node:fs/promises";

import exifr from "exifr";
import sharp from "sharp";

export type ExtractedPhotoExif = Readonly<{
  capturedAt: string | null;
  capturedAtOffset: string | null;

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

const nullableLocalDate = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const match = /^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(
    value.trim(),
  );

  if (!match) {
    return null;
  }

  const [, year, month, day, hour, minute, second] = match;

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
};

export const extractPhotoExif = async (
  imagePath: string,
): Promise<ExtractedPhotoExif> => {
  const [metadata, imageBuffer] = await Promise.all([
    sharp(imagePath).metadata(),
    readFile(imagePath),
  ]);

  if (!metadata.width || !metadata.height) {
    throw new Error(`Unable to determine image dimensions: ${imagePath}`);
  }

  // Read a Buffer to avoid exifr's Node file-handle issue.
  const exif = await exifr.parse(imageBuffer, {
    gps: true,
    tiff: true,
    exif: true,
    mergeOutput: true,
    reviveValues: false,
    xmp: false,
    icc: false,
  });

  return {
    capturedAt: nullableLocalDate(exif?.DateTimeOriginal ?? exif?.CreateDate),
    capturedAtOffset: nullableString(
      exif?.OffsetTimeOriginal ?? exif?.OffsetTime,
    ),

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

    width: metadata.width,
    height: metadata.height,

    latitude: nullableNumber(exif?.latitude),
    longitude: nullableNumber(exif?.longitude),
  };
};
