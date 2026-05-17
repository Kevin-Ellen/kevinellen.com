// packages/content-cli/src/content/photo/utils/prepare-upload.photo.util.content.ts

import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const MAX_IMAGE_BYTES = 20_000_000;

export type PreparedPhotoUpload = Readonly<{
  fileName: string;
  mimeType: "image/jpeg";
  buffer: ArrayBuffer;
  size: number;
}>;

const toArrayBuffer = (buffer: Buffer): ArrayBuffer =>
  buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;

export const preparePhotoUploadFile = async (
  imagePath: string,
): Promise<PreparedPhotoUpload> => {
  const sourceFileName = path.basename(imagePath);
  const uploadFileName = `${path.parse(sourceFileName).name}.jpg`;
  const originalBuffer = await fs.readFile(imagePath);

  for (let quality = 100; quality >= 70; quality -= 1) {
    const outputBuffer = await sharp(originalBuffer)
      .rotate()
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();

    if (outputBuffer.byteLength <= MAX_IMAGE_BYTES) {
      return {
        fileName: uploadFileName,
        mimeType: "image/jpeg",
        buffer: toArrayBuffer(outputBuffer),
        size: outputBuffer.byteLength,
      };
    }
  }

  throw new Error(
    `Image remains above Cloudflare Images limit after compression: ${sourceFileName}`,
  );
};
