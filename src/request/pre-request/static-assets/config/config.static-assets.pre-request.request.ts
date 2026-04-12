// src/request/pre-request/static-assets/config/config.static-assets.pre-request.request.ts

import type { resolveStaticAssetIcon } from "@request/pre-request/static-assets/types/static-assets.pre-request.request.types";

export const STATIC_ASSETS_DIRECT_PATHNAMES = new Set([
  "/favicon.ico",
  "/apple-touch-icon.png",
]);

export const STATIC_ASSETS_STARTS_PATHNAMES = ["/assets/"] as const;

export const STATIC_ASSETS_ICON_FILE_NAMES = new Set<resolveStaticAssetIcon>([
  "apple-touch-icon.png",
  "favicon.ico",
  "favicon-96x96.png",
  "ke-monogram-logo.svg",
  "web-app-manifest-192x192.png",
  "web-app-manifest-512x512.png",
]);

export const STATIC_ASSETS_ICON_ROOT_ALIASES: Record<
  string,
  `/assets/icons/${resolveStaticAssetIcon}`
> = {
  "/favicon.ico": "/assets/icons/favicon.ico",
  "/apple-touch-icon.png": "/assets/icons/apple-touch-icon.png",
};
