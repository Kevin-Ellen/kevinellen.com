// src/app/policies/request/system/build.sitemap-xml.system.ts

import type { AppState } from "@app/appState/class.appState";

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';

const XML_URLSET_OPEN =
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

const XML_URLSET_CLOSE = "</urlset>";

const escapeXml = (value: string): string => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

const buildAbsoluteUrl = (siteUrl: string, slug: string): string => {
  return new URL(slug, siteUrl).toString();
};

const getSitemapUrls = (appState: AppState): string[] => {
  const siteUrl = appState.site.siteUrl;

  return appState.publicPages
    .filter((page) => page.config.sitemap.include)
    .map((page) => buildAbsoluteUrl(siteUrl, page.core.slug))
    .sort((a, b) => a.localeCompare(b));
};

export const buildSitemapXmlSystem = (appState: AppState): string => {
  const urls = getSitemapUrls(appState);

  const urlEntries = urls.map((url) => {
    return `<url><loc>${escapeXml(url)}</loc></url>`;
  });

  return [XML_HEADER, XML_URLSET_OPEN, ...urlEntries, XML_URLSET_CLOSE].join(
    "",
  );
};
