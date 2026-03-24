// src/app/system/robots/build.robots.ts

import type { AppState } from "@app/appState/appState";
import type { RobotsDocument } from "@app/system/robots/robots.types";

export const buildRobotsDocument = (appState: AppState): RobotsDocument => {
  const siteConfig = appState.getSiteConfig();

  return {
    rules: [
      {
        userAgent: "*",
        disallow: [],
      },
    ],
    sitemaps: [`${siteConfig.siteUrl}/sitemap.xml`],
  };
};
