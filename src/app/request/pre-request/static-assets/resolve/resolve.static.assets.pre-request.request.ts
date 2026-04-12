// src/app/request/pre-request/static-assets/resolve/resolve.static.assets.pre-request.request.ts

import type {
  StaticAssetResolution,
  StaticAssetRequest,
  StaticAssetRequestResolver,
} from "@request/pre-request/static-assets/types/static-assets.pre-request.request.types";

import { staticAssetResolverIcon } from "@request/pre-request/static-assets/resolve/icon.resolve.static.assets.pre-request.request";
import { staticAssetResolverFont } from "@request/pre-request/static-assets/resolve/font.resolve.static.assets.pre-request.request";
import { staticAssetResolverImage } from "@request/pre-request/static-assets/resolve/image.resolve.static.assets.pre-request.request";

import {
  STATIC_ASSETS_DIRECT_PATHNAMES,
  STATIC_ASSETS_STARTS_PATHNAMES,
} from "@request/pre-request/static-assets/config/config.static-assets.pre-request.request";

const STATIC_ASSET_REQUEST_RESOLVERS: readonly StaticAssetRequestResolver[] = [
  staticAssetResolverIcon,
  staticAssetResolverFont,
  staticAssetResolverImage,
];

const isStaticAssetPathname = (pathname: string): boolean => {
  return (
    STATIC_ASSETS_DIRECT_PATHNAMES.has(pathname) ||
    STATIC_ASSETS_STARTS_PATHNAMES.some((prefix) => pathname.startsWith(prefix))
  );
};

const resolveStaticAssetRequest = (
  pathname: string,
): StaticAssetRequest | null => {
  for (const resolver of STATIC_ASSET_REQUEST_RESOLVERS) {
    const assetRequest = resolver(pathname);

    if (assetRequest) {
      return assetRequest;
    }
  }

  return null;
};

export const staticAssetResolver = (req: Request): StaticAssetResolution => {
  const pathname = new URL(req.url).pathname;

  const assetRequest = resolveStaticAssetRequest(pathname);

  if (assetRequest) {
    return {
      outcome: "asset",
      asset: assetRequest,
    };
  }

  if (isStaticAssetPathname(pathname)) {
    return {
      outcome: "unsupported-asset",
      pathname,
    };
  }

  return {
    outcome: "continue",
  };
};
