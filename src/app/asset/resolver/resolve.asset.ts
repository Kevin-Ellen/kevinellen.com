// src/app/asset/resolvers/resolve.asset.request.ts

import type {
  IconAssetFileName,
  AssetRequest,
} from "@app/asset/request/request.asset.types";
import type { AssetResolution } from "@app/asset/resolver/resolution.asset.types";

const ICON_FILE_NAMES = new Set<IconAssetFileName>([
  "apple-touch-icon.png",
  "favicon.ico",
  "favicon-96x96.png",
  "ke-monogram-logo.svg",
  "web-app-manifest-192x192.png",
  "web-app-manifest-512x512.png",
]);

const ICON_ROOT_ALIASES: Record<string, `/assets/icons/${IconAssetFileName}`> =
  {
    "/favicon.ico": "/assets/icons/favicon.ico",
    "/apple-touch-icon.png": "/assets/icons/apple-touch-icon.png",
  };

const getFileNameFromPath = (pathname: string): string => {
  const segments = pathname.split("/").filter(Boolean);

  return segments[segments.length - 1] ?? "";
};

const getExtensionFromFileName = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf(".");

  if (lastDotIndex === -1) {
    return "";
  }

  return fileName.slice(lastDotIndex + 1).toLowerCase();
};

const resolveIconAssetRequest = (
  requestPath: string,
  assetPath: `/assets/icons/${IconAssetFileName}`,
): AssetRequest | null => {
  const fileName = getFileNameFromPath(assetPath);

  if (!ICON_FILE_NAMES.has(fileName as IconAssetFileName)) {
    return null;
  }

  const extension = getExtensionFromFileName(fileName);

  switch (extension) {
    case "png":
      return {
        family: "icon",
        requestPath: requestPath as
          | `/assets/icons/${IconAssetFileName}`
          | "/favicon.ico"
          | "/apple-touch-icon.png",
        assetPath,
        fileName: fileName as IconAssetFileName,
        extension: "png",
        contentType: "image/png",
        cacheProfile: "icon",
      };

    case "svg":
      return {
        family: "icon",
        requestPath: requestPath as
          | `/assets/icons/${IconAssetFileName}`
          | "/favicon.ico"
          | "/apple-touch-icon.png",
        assetPath,
        fileName: fileName as IconAssetFileName,
        extension: "svg",
        contentType: "image/svg+xml",
        cacheProfile: "icon",
      };

    case "ico":
      return {
        family: "icon",
        requestPath: requestPath as
          | `/assets/icons/${IconAssetFileName}`
          | "/favicon.ico"
          | "/apple-touch-icon.png",
        assetPath,
        fileName: fileName as IconAssetFileName,
        extension: "ico",
        contentType: "image/x-icon",
        cacheProfile: "icon",
      };

    default:
      return null;
  }
};

const resolveFontAssetRequest = (pathname: string): AssetRequest | null => {
  const fileName = getFileNameFromPath(pathname);

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

const resolveImageAssetRequest = (pathname: string): AssetRequest | null => {
  const fileName = getFileNameFromPath(pathname);
  const extension = getExtensionFromFileName(fileName);

  switch (extension) {
    case "png":
      return {
        family: "image",
        requestPath: pathname as `/assets/images/${string}`,
        assetPath: pathname as `/assets/images/${string}`,
        fileName,
        extension: "png",
        contentType: "image/png",
        cacheProfile: "image",
      };

    case "jpg":
    case "jpeg":
      return {
        family: "image",
        requestPath: pathname as `/assets/images/${string}`,
        assetPath: pathname as `/assets/images/${string}`,
        fileName,
        extension,
        contentType: "image/jpeg",
        cacheProfile: "image",
      };

    case "webp":
      return {
        family: "image",
        requestPath: pathname as `/assets/images/${string}`,
        assetPath: pathname as `/assets/images/${string}`,
        fileName,
        extension: "webp",
        contentType: "image/webp",
        cacheProfile: "image",
      };

    case "avif":
      return {
        family: "image",
        requestPath: pathname as `/assets/images/${string}`,
        assetPath: pathname as `/assets/images/${string}`,
        fileName,
        extension: "avif",
        contentType: "image/avif",
        cacheProfile: "image",
      };

    default:
      return null;
  }
};

export const resolveAssetRequest = (req: Request): AssetResolution => {
  const url = new URL(req.url);
  const { pathname } = url;

  if (pathname in ICON_ROOT_ALIASES) {
    const assetPath = ICON_ROOT_ALIASES[pathname];

    const asset = resolveIconAssetRequest(pathname, assetPath);

    if (!asset) {
      return {
        outcome: "unsupported-asset",
        pathname,
      };
    }

    return {
      outcome: "asset",
      asset,
    };
  }

  if (pathname.startsWith("/assets/icons/")) {
    const asset = resolveIconAssetRequest(
      pathname,
      pathname as `/assets/icons/${IconAssetFileName}`,
    );

    if (!asset) {
      return {
        outcome: "unsupported-asset",
        pathname,
      };
    }

    return {
      outcome: "asset",
      asset,
    };
  }

  if (pathname.startsWith("/assets/fonts/")) {
    const asset = resolveFontAssetRequest(pathname);

    if (!asset) {
      return {
        outcome: "unsupported-asset",
        pathname,
      };
    }

    return {
      outcome: "asset",
      asset,
    };
  }

  if (pathname.startsWith("/assets/images/")) {
    const asset = resolveImageAssetRequest(pathname);

    if (!asset) {
      return {
        outcome: "unsupported-asset",
        pathname,
      };
    }

    return {
      outcome: "asset",
      asset,
    };
  }

  return {
    outcome: "not-asset",
  };
};
