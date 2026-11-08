// src/app/config/robots-txt.config.ts

import type { RobotsTxtConfigAuthored } from "../types/config/robots-txt/robots-txt.config.authored.type";

export const robotsTxtConfigAuthored = {
  groups: [
    {
      userAgents: ["*"],
    },
  ],
  sitemapPath: "/sitemap.xml",
} as const satisfies RobotsTxtConfigAuthored;
