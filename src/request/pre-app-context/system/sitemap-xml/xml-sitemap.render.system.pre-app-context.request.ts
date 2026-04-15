// src/request/pre-app-context/system/xml-sitemap/xml-sitemap.render.system.pre-app-context.request.ts

import type { RequestResult } from "@request/types/request.types";
import type { ResolvedXmlSitemapSystem } from "@request/pre-app-context/system/sitemap-xml/xml-sitemap.resolver.system.pre-app-context.request";

const escapeXml = (value: string): string => {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
};

export const renderXmlSitemapSystem = (
  resolved: ResolvedXmlSitemapSystem,
): RequestResult => {
  const urlsXml = resolved.urls
    .map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`)
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>
`;

  return {
    kind: "direct-response",
    response: new Response(body, {
      status: 200,
      headers: {
        "content-type": "application/xml; charset=utf-8",
      },
    }),
  };
};
