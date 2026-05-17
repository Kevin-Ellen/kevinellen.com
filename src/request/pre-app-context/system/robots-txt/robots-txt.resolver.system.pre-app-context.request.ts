// src/request/pre-app-context/system/robots-txt/robots-txt.resolver.system.pre-app-context.request.ts

import type { AppState } from "@app-state/class.app-state";

export type ResolvedRobotsTxtSystem = Readonly<{
  sitemapUrl: string | null;
  rules: readonly string[];
}>;

export const resolveRobotsTxtSystem = (
  req: Request,
  appState: AppState,
): ResolvedRobotsTxtSystem | null => {
  const url = new URL(req.url);

  if (url.pathname !== "/robots.txt") {
    return null;
  }

  const disallowRules = [
    ...new Set(
      appState.publicPages
        .filter((page) => page.robotsTxt !== null && page.robotsTxt.disallow)
        .map((page) => {
          if (page.slug === null) {
            throw new Error(`Public page '${page.id}' is missing a slug.`);
          }

          return `Disallow: ${page.slug}`;
        }),
    ),
  ].sort();

  return {
    sitemapUrl: `${appState.siteConfig.origin}/sitemap.xml`,
    rules: ["User-agent: *", "Allow: /", ...disallowRules],
  };
};
