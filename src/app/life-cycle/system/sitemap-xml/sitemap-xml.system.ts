// src/app/life-cycle/system/sitemap-xml/sitemap-xml.system.ts

import type { AppInit } from "../../app-init/class.app-init";
import type { PublishedRegistry } from "../../../../shared/types/content/kv-ledger.content.shared.type";
import type { XmlResponseOutput } from "../../../types/response/response.shared.type";

type ResolveSitemapSystemInput = Readonly<{
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

const createUrlEntry = (
  slug: string,
  canonicalDomain: string,
  photos: readonly string[] = [],
): string => {
  const url = new URL(slug, canonicalDomain);

  return [
    "<url>",
    `<loc>${escapeXml(url.href)}</loc>`,
    ...photos.flatMap((photo) => [
      "<image:image>",
      `<image:loc>${escapeXml(
        new URL(`/media/photo/${encodeURIComponent(photo)}`, canonicalDomain)
          .href,
      )}</image:loc>`,
      "</image:image>",
    ]),
    "</url>",
  ].join("\n");
};

export const resolveSitemapSystem = ({
  appInit,
  ledger,
}: ResolveSitemapSystemInput): XmlResponseOutput => {
  const { canonicalDomain } = appInit.site;

  const bundledEntries = Object.values(appInit.content.bySlug).flatMap(
    (page) => {
      if (!page.metadata.sitemap || page.slug === null) {
        return [];
      }

      return [createUrlEntry(page.slug, canonicalDomain)];
    },
  );

  const publishedEntries = Object.values(ledger.bySlug)
    .filter((entry) => entry.sitemap)
    .map((entry) => createUrlEntry(entry.slug, canonicalDomain, entry.photos));

  return {
    kind: "xml",
    status: 200,
    body: [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
      ...bundledEntries,
      ...publishedEntries,
      "</urlset>",
    ].join("\n"),
  };
};
