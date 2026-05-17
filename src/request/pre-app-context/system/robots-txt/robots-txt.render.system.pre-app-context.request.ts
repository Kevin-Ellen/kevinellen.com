// src/request/pre-app-context/system/robots-txt/robots-txt.render.system.pre-app-context.request.ts

import type { PreAppContextResult } from "@request/types/request.types";
import type { ResolvedRobotsTxtSystem } from "@request/pre-app-context/system/robots-txt/robots-txt.resolver.system.pre-app-context.request";

export const renderRobotsTxtSystem = (
  resolved: ResolvedRobotsTxtSystem,
): PreAppContextResult => {
  const lines = [...resolved.rules];

  if (resolved.sitemapUrl) {
    lines.push(`Sitemap: ${resolved.sitemapUrl}`);
  }

  const body = `${lines.join("\n")}\n`;

  return {
    kind: "direct-response",
    response: new Response(body, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    }),
  };
};
