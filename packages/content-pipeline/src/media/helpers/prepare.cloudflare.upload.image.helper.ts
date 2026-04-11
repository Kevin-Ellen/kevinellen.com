// packages/content-pipeline/src/media/helpers/prepare.cloudflare.upload.image.helper.ts

import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

type PrepareCloudflareUploadImageInput = {
  imageFilePath: string;
  copyright: string | null;
  photographer: string | null;
};

export type PrepareCloudflareUploadImageResult = {
  buffer: Buffer;
  fileName: string;
  mimeType: "image/jpeg";
  size: number;
};

const getFileSize = async (filePath: string): Promise<number> => {
  const stat = await fs.stat(filePath);

  return stat.size;
};

const renderMb = (bytes: number): string => {
  return (bytes / (1024 * 1024)).toFixed(2);
};

const getUploadFileName = (imageFilePath: string): string => {
  const parsed = path.parse(imageFilePath);

  return `${parsed.name}.jpg`;
};

const buildExif = (
  copyright: string | null,
  photographer: string | null,
): Record<string, Record<string, string>> | null => {
  const ifd0: Record<string, string> = {};

  if (copyright && copyright.trim().length > 0) {
    ifd0.Copyright = copyright;
  }

  if (photographer && photographer.trim().length > 0) {
    ifd0.Artist = photographer;
  }

  return Object.keys(ifd0).length > 0 ? { IFD0: ifd0 } : null;
};

const createJpegPipeline = (
  inputBuffer: Buffer,
  quality: number,
  exif: Record<string, Record<string, string>> | null,
  resizeWidth?: number,
) => {
  let pipeline = sharp(inputBuffer).rotate();

  if (resizeWidth) {
    pipeline = pipeline.resize({
      width: resizeWidth,
      withoutEnlargement: true,
    });
  }

  pipeline = pipeline.jpeg({
    quality,
    mozjpeg: true,
  });

  if (exif) {
    pipeline = pipeline.withExif(exif);
  }

  return pipeline;
};

const encodeJpeg = async (
  inputBuffer: Buffer,
  quality: number,
  exif: Record<string, Record<string, string>> | null,
  resizeWidth?: number,
): Promise<Buffer> => {
  return createJpegPipeline(inputBuffer, quality, exif, resizeWidth).toBuffer();
};

const findBestQualityUnderLimit = async (
  inputBuffer: Buffer,
  exif: Record<string, Record<string, string>> | null,
): Promise<{ buffer: Buffer; quality: number } | null> => {
  let low = 60;
  let high = 100;

  let bestBuffer: Buffer | null = null;
  let bestQuality: number | null = null;

  while (low <= high) {
    const quality = Math.floor((low + high) / 2);
    const buffer = await encodeJpeg(inputBuffer, quality, exif);

    if (buffer.length <= MAX_UPLOAD_SIZE_BYTES) {
      bestBuffer = buffer;
      bestQuality = quality;
      low = quality + 1;
    } else {
      high = quality - 1;
    }
  }

  if (!bestBuffer || bestQuality === null) {
    return null;
  }

  console.log(
    `Selected JPEG quality ${bestQuality} → ${renderMb(bestBuffer.length)} MB`,
  );

  return {
    buffer: bestBuffer,
    quality: bestQuality,
  };
};

export const prepareCloudflareUploadImage = async ({
  imageFilePath,
  copyright,
  photographer,
}: PrepareCloudflareUploadImageInput): Promise<PrepareCloudflareUploadImageResult> => {
  const originalSize = await getFileSize(imageFilePath);
  const originalFileName = path.basename(imageFilePath);
  const uploadFileName = getUploadFileName(imageFilePath);

  const inputBuffer = await fs.readFile(imageFilePath);
  const exif = buildExif(copyright, photographer);

  if (originalSize <= MAX_UPLOAD_SIZE_BYTES) {
    const outputBuffer = await encodeJpeg(inputBuffer, 100, exif);

    console.log(
      `Image "${originalFileName}" fits within limit → prepared as ${uploadFileName} (${renderMb(outputBuffer.length)} MB)`,
    );

    return {
      buffer: outputBuffer,
      fileName: uploadFileName,
      mimeType: "image/jpeg",
      size: outputBuffer.length,
    };
  }

  console.log(
    `Image "${originalFileName}" is ${renderMb(originalSize)} MB — compressing for Cloudflare upload...`,
  );

  let outputBuffer = (await findBestQualityUnderLimit(inputBuffer, exif))
    ?.buffer;

  if (!outputBuffer) {
    console.log("Quality reduction insufficient — applying resize fallback...");

    const metadata = await sharp(inputBuffer).metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error(
        `Could not determine image dimensions for resize fallback`,
      );
    }

    const scale = Math.sqrt(MAX_UPLOAD_SIZE_BYTES / originalSize);
    const targetWidth = Math.max(1, Math.floor(metadata.width * scale));

    outputBuffer = await encodeJpeg(inputBuffer, 90, exif, targetWidth);

    if (outputBuffer.length > MAX_UPLOAD_SIZE_BYTES) {
      throw new Error(
        `Failed to reduce image "${originalFileName}" below 10MB limit`,
      );
    }

    console.log(
      `Resize fallback applied → ${renderMb(outputBuffer.length)} MB`,
    );
  }

  console.log(
    `Image "${originalFileName}" prepared as ${uploadFileName} (${renderMb(outputBuffer.length)} MB)`,
  );

  return {
    buffer: outputBuffer,
    fileName: uploadFileName,
    mimeType: "image/jpeg",
    size: outputBuffer.length,
  };
};
