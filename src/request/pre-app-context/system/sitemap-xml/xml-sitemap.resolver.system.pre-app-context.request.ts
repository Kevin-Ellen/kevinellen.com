// src/request/pre-app-context/system/sitemap-xml/xml-sitemap.resolver.system.pre-app-context.request.ts

import type { AppState } from "@app-state/class.app-state";

export type ResolvedXmlSitemapSystem = Readonly<{
  urls: readonly string[];
}>;

export const resolveXmlSitemapSystem = (
  req: Request,
  appState: AppState,
): ResolvedXmlSitemapSystem | null => {
  const url = new URL(req.url);

  if (url.pathname !== "/sitemap.xml") {
    return null;
  }

  const baseUrl = appState.siteConfig.origin;

  const urls = appState.publicPages
    .filter((page) => page.sitemapXml !== null && page.sitemapXml.include)
    .map((page) => {
      if (page.slug === null) {
        throw new Error(`Public page '${page.id}' is missing a slug.`);
      }

      return `${baseUrl}${page.slug}`;
    });

  return {
    urls,
  };
};
