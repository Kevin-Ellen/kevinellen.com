// src/app/policies/request/system/build.robots-txt.request.system.ts

import type { AppState } from "@app/appState/class.appState";

const joinRobotsTxtLines = (lines: readonly string[]): string => {
  return `${lines.join("\n")}\n`;
};

const buildSitemapUrl = (siteUrl: string): string => {
  return new URL("/sitemap.xml", siteUrl).toString();
};

const getDisallowedPaths = (appState: AppState): string[] => {
  return appState.publicPages
    .filter((page) => page.config.robotsTxt.disallow)
    .map((page) => page.core.slug)
    .sort((a, b) => a.localeCompare(b));
};

export const buildRobotsTxtRequestSystem = (appState: AppState): string => {
  const lines: string[] = ["User-agent: *"];

  const disallowedPaths = getDisallowedPaths(appState);

  for (const path of disallowedPaths) {
    lines.push(`Disallow: ${path}`);
  }

  lines.push(`Sitemap: ${buildSitemapUrl(appState.site.siteUrl)}`);

  return joinRobotsTxtLines(lines);
};
