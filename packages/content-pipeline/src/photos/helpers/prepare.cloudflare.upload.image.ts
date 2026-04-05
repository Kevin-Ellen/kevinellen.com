// packages/content-pipeline/src/photos/helpers/prepare.cloudflare.upload.image.ts

import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;
const TARGET_UPLOAD_SIZE_BYTES = Math.floor(9.5 * 1024 * 1024);

type PrepareCloudflareUploadImageResult = {
  buffer: Buffer;
  fileName: string;
  size: number;
};

const getFileSize = async (filePath: string): Promise<number> => {
  const stat = await fs.stat(filePath);
  return stat.size;
};

const renderMb = (bytes: number): string => {
  return (bytes / (1024 * 1024)).toFixed(2);
};

const encodeJpeg = async (
  inputBuffer: Buffer,
  quality: number,
): Promise<Buffer> => {
  return sharp(inputBuffer)
    .jpeg({
      quality,
      mozjpeg: true,
    })
    .toBuffer();
};

const findBestQualityUnderLimit = async (
  inputBuffer: Buffer,
): Promise<Buffer | null> => {
  let low = 60;
  let high = 100;

  let bestBuffer: Buffer | null = null;
  let bestQuality: number | null = null;

  while (low <= high) {
    const quality = Math.floor((low + high) / 2);
    const buffer = await encodeJpeg(inputBuffer, quality);

    if (buffer.length <= TARGET_UPLOAD_SIZE_BYTES) {
      bestBuffer = buffer;
      bestQuality = quality;
      low = quality + 1;
    } else {
      high = quality - 1;
    }
  }

  if (bestBuffer && bestQuality !== null) {
    console.log(
      `Selected JPEG quality ${bestQuality} → ${renderMb(bestBuffer.length)} MB`,
    );
  }

  return bestBuffer;
};

export const prepareCloudflareUploadImage = async (
  imageFilePath: string,
): Promise<PrepareCloudflareUploadImageResult> => {
  const originalSize = await getFileSize(imageFilePath);
  const fileName = path.basename(imageFilePath);

  if (originalSize <= MAX_UPLOAD_SIZE_BYTES) {
    const buffer = await fs.readFile(imageFilePath);

    return {
      buffer,
      fileName,
      size: originalSize,
    };
  }

  console.log(
    `Image "${fileName}" is ${renderMb(originalSize)} MB — compressing for Cloudflare upload...`,
  );

  const inputBuffer = await fs.readFile(imageFilePath);

  let outputBuffer = await findBestQualityUnderLimit(inputBuffer);

  if (!outputBuffer) {
    console.log(`Quality reduction insufficient — applying resize fallback...`);

    const metadata = await sharp(inputBuffer).metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error(
        `Could not determine image dimensions for resize fallback`,
      );
    }

    const scale = Math.sqrt(TARGET_UPLOAD_SIZE_BYTES / originalSize);
    const targetWidth = Math.max(1, Math.floor(metadata.width * scale));

    outputBuffer = await sharp(inputBuffer)
      .resize({
        width: targetWidth,
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 90,
        mozjpeg: true,
      })
      .toBuffer();

    if (outputBuffer.length > MAX_UPLOAD_SIZE_BYTES) {
      throw new Error(`Failed to reduce image "${fileName}" below 10MB limit`);
    }

    console.log(
      `Resize fallback applied → ${renderMb(outputBuffer.length)} MB`,
    );
  }

  await fs.writeFile(imageFilePath, outputBuffer);

  console.log(
    `Image "${fileName}" compressed from ${renderMb(originalSize)} MB to ${renderMb(outputBuffer.length)} MB`,
  );

  return {
    buffer: outputBuffer,
    fileName,
    size: outputBuffer.length,
  };
};
