// src/app/system/xml-sitemap/render.xml-sitemap.ts

import type { SitemapDocument } from "@app/system/xml-sitemap/xml-sitemap.types";

import { escapeXmlContent } from "@utils/escapeContent.util";

export const renderXmlSitemap = (doc: SitemapDocument): string => {
  const urls = doc.urls
    .map((url) => {
      const lines = ["<url>", `<loc>${escapeXmlContent(url.loc)}</loc>`];

      if (url.lastmod) {
        lines.push(`<lastmod>${escapeXmlContent(url.lastmod)}</lastmod>`);
      }

      lines.push("</url>");

      return lines.join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
};
