// packages/content-pipeline/src/photos/helpers/scan.images.folder.ts

import fs from "node:fs/promises";
import path from "node:path";

const IMAGE_FILE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export const scanImagesFolder = async (
  imagesFolderPath: string,
): Promise<string[]> => {
  const entries = await fs.readdir(imagesFolderPath, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => {
      const extension = path.extname(fileName).toLowerCase();
      return IMAGE_FILE_EXTENSIONS.has(extension);
    })
    .sort((a, b) => a.localeCompare(b))
    .map((fileName) => path.join(imagesFolderPath, fileName));
};
