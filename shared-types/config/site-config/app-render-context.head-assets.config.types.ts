// shared-types/config/site-config/app-render-context.head-assets.config.types.ts

import type { AppContextHeadAssets } from "@shared-types/config/site-config/app-context.head-assets.config.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppRenderContextFaviconIcoHeadLinkAsset = Replace<
  AppContextHeadAssets["faviconIco"],
  Readonly<{
    rel: "icon";
  }>
>;

export type AppRenderContextFaviconSvgHeadLinkAsset = Replace<
  AppContextHeadAssets["faviconSvg"],
  Readonly<{
    rel: "icon";
  }>
>;

export type AppRenderContextFaviconPngHeadLinkAsset = Replace<
  AppContextHeadAssets["faviconPng"],
  Readonly<{
    rel: "icon";
  }>
>;

export type AppRenderContextAppleTouchIconHeadLinkAsset = Replace<
  AppContextHeadAssets["appleTouchIcon"],
  Readonly<{
    rel: "apple-touch-icon";
  }>
>;

export type AppRenderContextManifestHeadLinkAsset = Replace<
  AppContextHeadAssets["manifest"],
  Readonly<{
    rel: "manifest";
  }>
>;

export type AppRenderContextHeadLinkAsset =
  | AppRenderContextFaviconIcoHeadLinkAsset
  | AppRenderContextFaviconSvgHeadLinkAsset
  | AppRenderContextFaviconPngHeadLinkAsset
  | AppRenderContextAppleTouchIconHeadLinkAsset
  | AppRenderContextManifestHeadLinkAsset;
