// src/app-render-context/resolve/doc-open/head-links.assets.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextHeadLinkAsset } from "@shared-types/config/site-config/app-render-context.head-assets.config.types";

export const resolveHeadLinksAppRenderContext = (
  appContext: AppContext,
): readonly AppRenderContextHeadLinkAsset[] => {
  const { headAssets } = appContext;

  return [
    {
      kind: "favicon-ico",
      href: headAssets.faviconIco.href,
    },
    {
      kind: "favicon-svg",
      href: headAssets.faviconSvg.href,
      type: headAssets.faviconSvg.type,
    },
    {
      kind: "favicon-png",
      href: headAssets.faviconPng.href,
      sizes: headAssets.faviconPng.sizes,
      type: headAssets.faviconPng.type,
    },
    {
      kind: "apple-touch-icon",
      href: headAssets.appleTouchIcon.href,
    },
    {
      kind: "manifest",
      href: headAssets.manifest.href,
    },
  ];
};
