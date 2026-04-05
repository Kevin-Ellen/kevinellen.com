// packages/shared-types/src/content/pages/base.page.definition.ts

import type { PageAssetsAuthored } from "@shared-types/assets/page.assets.authored.types";

export type PageId = string;

export type BasePageDefinitionCore = {
  id: PageId;
  kind: string;
  label: string;
};

export type PageRobotsAuthored = {
  allowIndex: boolean;
  allowFollow: boolean;
  noarchive: boolean;
  nosnippet: boolean;
  noimageindex: boolean;
};

export type PageRobotsTxtAuthored = {
  disallow: boolean;
};

export type PageSitemapAuthored = {
  include: boolean;
};

export type PublicPageConfigAuthored = {
  robots: PageRobotsAuthored;
  robotsTxt: PageRobotsTxtAuthored;
  sitemap: PageSitemapAuthored;
};

export type PageMetaAuthored = {
  pageTitle: string;
  metaDescription: string;
};

export type BreadcrumbTrailAuthored = readonly PageId[];

export type BasePageDefinition<TCore, TConfig, TContent> = {
  core: TCore;
  config: TConfig;
  meta: PageMetaAuthored;
  breadcrumbs: BreadcrumbTrailAuthored;
  content: TContent;
  assets: PageAssetsAuthored;
};
