// src/tools/authored-content-generator/publish/photo/prepare.photo.publish.ts

import { readFile } from "node:fs/promises";
import sharp from "sharp";

const MAX_IMAGE_BYTES = 20 * 1024 * 1024;

export const prepareImageForUpload = async (
  imagePath: string,
): Promise<Buffer> => {
  const original = await readFile(imagePath);

  if (original.byteLength <= MAX_IMAGE_BYTES) {
    return original;
  }

  for (let quality = 99; quality >= 1; quality--) {
    const optimised = await sharp(original)
      .jpeg({
        quality,
        mozjpeg: true,
      })
      .toBuffer();

    if (optimised.byteLength <= MAX_IMAGE_BYTES) {
      console.log(
        `✓ Image optimised: ${quality}% quality, ` +
          `${(original.byteLength / 1024 / 1024).toFixed(2)} → ` +
          `${(optimised.byteLength / 1024 / 1024).toFixed(2)} MiB`,
      );

      return optimised;
    }
  }

  throw new Error(`Unable to reduce image below 20 MiB: ${imagePath}`);
};
