// src/app/life-cycle/app-init/resolvers/robots-txt/robots-txt.resolver.app-init.ts

import type { RobotsTxtConfigAuthored } from "../../../../types/config/robots-txt/robots-txt.config.authored.type";
import type { RobotsTxtConfigAppInit } from "../../../../types/config/robots-txt/robots-txt.config.app-init.type";

type Input = Readonly<{
  authored: RobotsTxtConfigAuthored;
  canonicalDomain: string;
}>;

export const resolveRobotsTxtConfigAppInit = ({
  authored,
  canonicalDomain,
}: Input): RobotsTxtConfigAppInit => ({
  groups: authored.groups.map((group) => ({
    userAgents: group.userAgents,
    allow: group.allow ?? [],
    disallow: group.disallow ?? [],
    crawlDelay: group.crawlDelay ?? null,
  })),
  sitemapUrl: new URL(authored.sitemapPath, canonicalDomain).href,
});
