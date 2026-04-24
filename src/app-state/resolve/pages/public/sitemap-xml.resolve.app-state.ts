// src/app-state/resolve/pages/public/sitemap-xml.resolve.app-state.ts

import type { AuthoredPageSitemapXmlDirectives } from "@shared-types/page-definitions/sitemap-xml/authored.sitemap-xml.page-definition.types";
import type { AppStatePageSitemapXmlDirectives } from "@shared-types/page-definitions/sitemap-xml/app-state.sitemap-xml.page-definition.types";

const DEFAULT_APP_STATE_SITEMAP_XML = true;

export const appStateResolvePageSitemapXml = (
  sitemapXml?: AuthoredPageSitemapXmlDirectives,
): AppStatePageSitemapXmlDirectives => {
  return {
    include: sitemapXml?.include ?? DEFAULT_APP_STATE_SITEMAP_XML,
  };
};
