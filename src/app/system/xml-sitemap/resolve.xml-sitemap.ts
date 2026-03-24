// src/app/system/xml-sitemap/resolve.xml-sitemap.ts

import type { AppState } from "@app/appState/appState";
import type { RequestResolutionOutcome } from "@app/request/resolution/apply.resolution.types";

import { buildXmlSitemap } from "@app/system/xml-sitemap/build.xml-sitemap";
import { renderXmlSitemap } from "@app/system/xml-sitemap/render.xml-sitemap";

const isSitemapRequest = (req: Request): boolean => {
  const url = new URL(req.url);
  return url.pathname === "/sitemap.xml";
};

export const resolveXmlSitemapRequest = (
  req: Request,
  appState: AppState,
): RequestResolutionOutcome => {
  if (!isSitemapRequest(req)) {
    return { type: "continue" };
  }

  const doc = buildXmlSitemap(appState);
  const body = renderXmlSitemap(doc);

  return {
    type: "direct-response",
    responseFormat: "xml",
    response: new Response(body, {
      status: 200,
      headers: {
        "content-type": "application/xml; charset=utf-8",
      },
    }),
  };
};
