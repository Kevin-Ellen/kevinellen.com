// src/app/system/xml-sitemap/xml-sitemap.types.ts

export type SitemapUrl = {
  readonly loc: string;
  readonly lastmod?: string;
};

export type SitemapDocument = {
  readonly urls: readonly SitemapUrl[];
};
