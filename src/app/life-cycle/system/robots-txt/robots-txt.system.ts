// src/app/life-cycle/system/robots-txt/robots-txt.system.ts

import type { AppInit } from "../../app-init/class.app-init";
import type { TextResponseOutput } from "../../../types/response/response.shared.type";

type Input = Readonly<{
  appInit: AppInit;
}>;

export const resolveRobotsTxtSystem = ({
  appInit,
}: Input): TextResponseOutput => {
  const { groups, sitemapUrl } = appInit.robotsTxt;

  const body = [
    ...groups.flatMap((group) => [
      ...group.userAgents.map((agent) => `User-agent: ${agent}`),
      ...group.allow.map((path) => `Allow: ${path}`),
      ...group.disallow.map((path) => `Disallow: ${path}`),
      ...(group.crawlDelay === null
        ? []
        : [`Crawl-delay: ${group.crawlDelay}`]),
      "",
    ]),
    `Sitemap: ${sitemapUrl}`,
    "",
  ].join("\n");

  return {
    kind: "txt",
    status: 200,
    body,
  };
};
