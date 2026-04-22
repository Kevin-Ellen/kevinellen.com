// src/app-render-context/resolve/head-links.assets.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextHeadLinkAsset } from "@shared-types/config/site-config/app-render-context.head-assets.config.types";

export const resolveHeadLinksAppRenderContext = (
  appContext: AppContext,
): readonly AppRenderContextHeadLinkAsset[] => {
  const { headAssets } = appContext;

  return [
    {
      rel: "icon",
      href: headAssets.faviconIco.href,
    },
    {
      rel: "icon",
      href: headAssets.faviconSvg.href,
      type: headAssets.faviconSvg.type,
    },
    {
      rel: "icon",
      href: headAssets.faviconPng.href,
      sizes: headAssets.faviconPng.sizes,
      type: headAssets.faviconPng.type,
    },
    {
      rel: "apple-touch-icon",
      href: headAssets.appleTouchIcon.href,
    },
    {
      rel: "manifest",
      href: headAssets.manifest.href,
    },
  ];
};
