// src/app-state/resolve/pages/public/sitemap-xml.resolve.app-state.ts

import type { AuthoredSitemapXml } from "@shared-types/pages/public/sitemap-xml/authored.sitemap-xml.public.page.types";
import type { AppStateSitemapXml } from "@shared-types/pages/public/sitemap-xml/app-state.sitemap-xml.public.page.types";

const DEFAULT_APP_STATE_SITEMAP_XML = true;

export const appStateResolvePageSitemapXml = (
  sitemapXml?: AuthoredSitemapXml,
): AppStateSitemapXml => {
  return {
    include: sitemapXml?.include ?? DEFAULT_APP_STATE_SITEMAP_XML,
  };
};
