// src/request/pre-request/static-assets/resolve/font.resolve.static.assets.pre-request.request.ts

import type { StaticAssetRequestResolver } from "@request/pre-request/static-assets/types/static-assets.pre-request.request.types";

// import { getFileNameFromPathname } from "@utils/fileNameFromPath.util";

export const staticAssetResolverFont: StaticAssetRequestResolver = (
  pathname,
) => {
  if (!pathname.startsWith("/assets/fonts/")) {
    return null;
  }

  // const fileName = getFileNameFromPathname(pathname);
  const fileName = pathname.substring(pathname.lastIndexOf("/") + 1);

  if (!fileName.endsWith(".woff2")) {
    return null;
  }

  return {
    family: "font",
    requestPath: pathname as `/assets/fonts/${string}.woff2`,
    assetPath: pathname as `/assets/fonts/${string}.woff2`,
    fileName: fileName as `${string}.woff2`,
    extension: "woff2",
    contentType: "font/woff2",
    cacheProfile: "font",
  };
};
