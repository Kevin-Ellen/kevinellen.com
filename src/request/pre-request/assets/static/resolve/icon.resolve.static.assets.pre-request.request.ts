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
  fileName: string,
): "png" | "svg" | "ico" | null => {
  if (fileName.endsWith(".png")) {
    return "png";
  }

  if (fileName.endsWith(".svg")) {
    return "svg";
  }

  if (fileName.endsWith(".ico")) {
    return "ico";
  }

  return null;
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

export const staticAssetResolverIcon: StaticAssetRequestResolver = (
  pathname,
) => {
  const aliasedAssetPath = STATIC_ASSETS_ICON_ROOT_ALIASES[pathname];
  const assetPath = aliasedAssetPath
    ? aliasedAssetPath
    : pathname.startsWith("/assets/icons/")
      ? (pathname as `/assets/icons/${resolveStaticAssetIcon}`)
      : null;

  if (!assetPath) {
    return null;
  }

  const fileName = getFileNameFromPathname(assetPath) as resolveStaticAssetIcon;

  if (!STATIC_ASSETS_ICON_FILE_NAMES.has(fileName)) {
    return null;
  }

  const extension = getExtensionFromFileName(fileName);

  if (!extension) {
    return null;
  }

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
