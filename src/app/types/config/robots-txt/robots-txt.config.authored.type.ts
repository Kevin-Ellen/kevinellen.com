// src/app/types/config/robots-txt/robots-txt.config.authored.type.ts

export type RobotsTxtGroupAuthored = Readonly<{
  userAgents: readonly string[];
  allow?: readonly string[];
  disallow?: readonly string[];
  crawlDelay?: number;
}>;

export type RobotsTxtConfigAuthored = Readonly<{
  groups: readonly RobotsTxtGroupAuthored[];
  sitemapPath: string;
}>;
