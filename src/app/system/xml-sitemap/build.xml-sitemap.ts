// src/app/system/xml-sitemap/build.xml-sitemap.ts

import type { AppState } from "@app/appState/appState";
import type { SitemapDocument } from "@app/system/xml-sitemap/xml-sitemap.types";

export const buildXmlSitemap = (appState: AppState): SitemapDocument => {
  const siteConfig = appState.getSiteConfig();

  return {
    urls: [
      {
        loc: siteConfig.siteUrl,
      },
    ],
  };
};
