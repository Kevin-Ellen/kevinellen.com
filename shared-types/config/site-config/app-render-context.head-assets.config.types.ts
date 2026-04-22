// shared-types/config/site-config/app-render-context.head-assets.config.types.ts

import type { AppContextHeadAssets } from "@shared-types/config/site-config/app-context.head-assets.config.types";
import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppRenderContextHeadLinkAssetBase = Readonly<{
  rel: "icon" | "apple-touch-icon" | "manifest";
  href: string;
  type?: string;
  sizes?: string;
}>;

export type AppRenderContextFaviconIcoHeadLinkAsset = ReplaceAndOmit<
  AppContextHeadAssets["faviconIco"],
  Readonly<{
    rel: "icon";
  }>,
  never
>;

export type AppRenderContextFaviconSvgHeadLinkAsset = ReplaceAndOmit<
  AppContextHeadAssets["faviconSvg"],
  Readonly<{
    rel: "icon";
  }>,
  never
>;

export type AppRenderContextFaviconPngHeadLinkAsset = ReplaceAndOmit<
  AppContextHeadAssets["faviconPng"],
  Readonly<{
    rel: "icon";
  }>,
  never
>;

export type AppRenderContextAppleTouchIconHeadLinkAsset = ReplaceAndOmit<
  AppContextHeadAssets["appleTouchIcon"],
  Readonly<{
    rel: "apple-touch-icon";
  }>,
  never
>;

export type AppRenderContextManifestHeadLinkAsset = ReplaceAndOmit<
  AppContextHeadAssets["manifest"],
  Readonly<{
    rel: "manifest";
  }>,
  never
>;

export type AppRenderContextHeadLinkAsset =
  | AppRenderContextFaviconIcoHeadLinkAsset
  | AppRenderContextFaviconSvgHeadLinkAsset
  | AppRenderContextFaviconPngHeadLinkAsset
  | AppRenderContextAppleTouchIconHeadLinkAsset
  | AppRenderContextManifestHeadLinkAsset;

export type AppRenderContextHeadAssets = Readonly<{
  links: readonly AppRenderContextHeadLinkAsset[];
}>;
