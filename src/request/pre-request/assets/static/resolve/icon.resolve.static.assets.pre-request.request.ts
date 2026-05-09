// src/request/pre-request/assets/static/resolve/icon.resolve.static.assets.pre-request.request.ts

import type {
  StaticAssetRequestResolver,
  resolveStaticAssetIcon,
} from "@request/pre-request/assets/static/types/static-assets.pre-request.request.types";

import {
  STATIC_ASSETS_ICON_FILE_NAMES,
  STATIC_ASSETS_ICON_ROOT_ALIASES,
} from "@request/pre-request/assets/static/config/config.static-assets.pre-request.request";

const getFileNameFromPathname = (pathname: string): string => {
  const segments = pathname.split("/").filter(Boolean);
  return segments[segments.length - 1];
};

const getExtensionFromFileName = (
  fileName: resolveStaticAssetIcon,
): "png" | "svg" | "ico" => {
  if (fileName.endsWith(".png")) return "png";
  if (fileName.endsWith(".svg")) return "svg";

  return "ico";
};

const getContentTypeFromExtension = (
  extension: "png" | "svg" | "ico",
): "image/png" | "image/svg+xml" | "image/x-icon" => {
  switch (extension) {
    case "png":
      return "image/png";

    case "svg":
      return "image/svg+xml";

    case "ico":
      return "image/x-icon";
  }
};

const resolveIconAssetPath = (
  pathname: string,
): `/assets/icons/${resolveStaticAssetIcon}` | null => {
  const aliasedAssetPath = STATIC_ASSETS_ICON_ROOT_ALIASES[pathname];

  if (aliasedAssetPath) {
    return aliasedAssetPath;
  }

  if (pathname.startsWith("/assets/icons/")) {
    return pathname as `/assets/icons/${resolveStaticAssetIcon}`;
  }

  return null;
};

export const staticAssetResolverIcon: StaticAssetRequestResolver = (
  pathname,
) => {
  const assetPath = resolveIconAssetPath(pathname);

  if (!assetPath) {
    return null;
  }

  const fileName = getFileNameFromPathname(assetPath) as resolveStaticAssetIcon;

  if (!STATIC_ASSETS_ICON_FILE_NAMES.has(fileName)) {
    return null;
  }

  const extension = getExtensionFromFileName(fileName);

  return {
    family: "icon",
    requestPath: pathname as
      | `/assets/icons/${resolveStaticAssetIcon}`
      | "/favicon.ico"
      | "/apple-touch-icon.png",
    assetPath,
    fileName,
    extension,
    contentType: getContentTypeFromExtension(extension),
    cacheProfile: "icon",
  };
};
