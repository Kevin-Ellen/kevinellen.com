// src/request/pre-request/static-assets/resolve/image.resolve.static.assets.pre-request.request.ts

import type { StaticAssetRequestResolver } from "@request/pre-request/static-assets/types/static-assets.pre-request.request.types";

const getImageExtension = (
  fileName: string,
): "png" | "jpg" | "jpeg" | "webp" | "avif" | null => {
  if (fileName.endsWith(".png")) return "png";
  if (fileName.endsWith(".jpg")) return "jpg";
  if (fileName.endsWith(".jpeg")) return "jpeg";
  if (fileName.endsWith(".webp")) return "webp";
  if (fileName.endsWith(".avif")) return "avif";

  return null;
};

const getImageContentType = (
  extension: "png" | "jpg" | "jpeg" | "webp" | "avif",
): "image/png" | "image/jpeg" | "image/webp" | "image/avif" => {
  switch (extension) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "avif":
      return "image/avif";
  }
};

export const staticAssetResolverImage: StaticAssetRequestResolver = (
  pathname,
) => {
  if (!pathname.startsWith("/assets/images/")) {
    return null;
  }

  const fileName = pathname.substring(pathname.lastIndexOf("/") + 1);

  const extension = getImageExtension(fileName);

  if (!extension) {
    return null;
  }

  return {
    family: "image",
    requestPath: pathname as `/assets/images/${string}`,
    assetPath: pathname as `/assets/images/${string}`,
    fileName,
    extension,
    contentType: getImageContentType(extension),
    cacheProfile: "image",
  };
};
