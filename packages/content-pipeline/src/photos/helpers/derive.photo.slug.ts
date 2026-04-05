// packages/content-pipeline/src/photos/helpers/derive.photo.slug.ts

import path from "node:path";

export const derivePhotoSlug = (fileName: string): string => {
  const nameWithoutExtension = path.basename(fileName, path.extname(fileName));

  return nameWithoutExtension
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};
