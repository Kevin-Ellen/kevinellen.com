// src/app/life-cycle/system/rss-feed/rss-feed.system.ts

import type { AppInit } from "../../app-init/class.app-init";
import type { PublishedRegistry } from "../../../../shared/types/content/kv-ledger.content.shared.type";
import type { XmlResponseOutput } from "../../../types/response/response.shared.type";

type ResolveRssFeedSystemInput = Readonly<{
  appInit: AppInit;
  ledger: PublishedRegistry;
}>;

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const createRssEntry = (
  entry: PublishedRegistry["newestFirst"][number],
  canonicalDomain: string,
): string => {
  const url = new URL(entry.slug, canonicalDomain).href;

  return [
    "<item>",
    `<title>${escapeXml(entry.title)}</title>`,
    `<link>${escapeXml(url)}</link>`,
    `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
    `<description>${escapeXml(entry.intro)}</description>`,
    `<pubDate>${new Date(entry.dateCreated).toUTCString()}</pubDate>`,
    "</item>",
  ].join("\n");
};

export const resolveRssFeedSystem = ({
  appInit,
  ledger,
}: ResolveRssFeedSystemInput): XmlResponseOutput => {
  const { canonicalDomain, description, language } = appInit.site;

  const entries = ledger.newestFirst
    .filter((entry) => entry.sitemap)
    .slice(0, 25)
    .map((entry) => createRssEntry(entry, canonicalDomain));

  return {
    kind: "xml",
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
    body: [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<rss version="2.0">',
      "<channel>",
      "<title>Kevin Ellen — Wildlife Photography & Field Notes</title>",
      `<link>${escapeXml(canonicalDomain)}</link>`,
      `<description>${escapeXml(description)}</description>`,
      `<language>${escapeXml(language)}</language>`,
      ...entries,
      "</channel>",
      "</rss>",
    ].join("\n"),
  };
};
