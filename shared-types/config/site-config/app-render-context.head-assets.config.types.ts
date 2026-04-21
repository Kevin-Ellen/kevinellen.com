// shared-types/config/site-config/app-render-context.head-assets.config.types.ts

import type { AppContextHeadAssets } from "@shared-types/config/site-config/app-context.head-assets.config.types";

export type AppRenderContextHeadAssets = AppContextHeadAssets;

export type AppRenderContextHeadLinkAsset = Readonly<
  | {
      kind: "favicon-ico";
      href: AppContextHeadAssets["faviconIco"]["href"];
    }
  | {
      kind: "favicon-svg";
      href: AppContextHeadAssets["faviconSvg"]["href"];
      type: AppContextHeadAssets["faviconSvg"]["type"];
    }
  | {
      kind: "favicon-png";
      href: AppContextHeadAssets["faviconPng"]["href"];
      sizes: AppContextHeadAssets["faviconPng"]["sizes"];
      type: AppContextHeadAssets["faviconPng"]["type"];
    }
  | {
      kind: "apple-touch-icon";
      href: AppContextHeadAssets["appleTouchIcon"]["href"];
    }
  | {
      kind: "manifest";
      href: AppContextHeadAssets["manifest"]["href"];
    }
>;
