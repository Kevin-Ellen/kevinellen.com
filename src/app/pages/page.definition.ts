// src/app/pages/page.definition.ts

import type { ScriptAsset } from "@app/assets/scripts/scripts.assets.types";
import type { SvgAsset } from "@app/assets/svgs/svgs.assets.types";
import type { StructuredDataNode } from "@app/config/structuredData.config.types";

/* -------------------------------------------------------------------------- */
/* Core identity                                                               */
/* -------------------------------------------------------------------------- */

export type PageKind =
  | "home"
  | "static"
  | "listing"
  | "article"
  | "photo"
  | "tag"
  | "error";

export type PageRenderMode = "bundled" | "request-composed";

export type PageId = string;

export type PageDefinitionCore = {
  id: PageId;
  kind: PageKind;
  slug: string;
  renderMode: PageRenderMode;
  label: string;
};

/* -------------------------------------------------------------------------- */
/* Routing and discoverability                                                 */
/* -------------------------------------------------------------------------- */

export type PageRobotsConfig = {
  allowIndex: boolean;
  allowFollow: boolean;
  noarchive: boolean;
  nosnippet: boolean;
  noimageindex: boolean;
};

export type PageRobotsTxtConfig = {
  disallow: boolean;
};

export type PageSitemapConfig = {
  include: boolean;
};

export type PageStructuredDataFlags = {
  breadcrumbs?: boolean;
  webPage?: boolean;
  article?: boolean;
  imageObject?: boolean;
  collectionPage?: boolean;
};

export type PageDefinitionConfig = {
  robots: PageRobotsConfig;
  robotsTxt: PageRobotsTxtConfig;
  sitemap: PageSitemapConfig;
  structuredData?: PageStructuredDataFlags;
};

/* -------------------------------------------------------------------------- */
/* Document head                                                               */
/* -------------------------------------------------------------------------- */

export type PageDocumentHead = {
  pageTitle: string;
  metaDescription: string;
};

/* -------------------------------------------------------------------------- */
/* Page head                                                                   */
/* -------------------------------------------------------------------------- */

export type BreadcrumbReference = PageId;

export type BreadcrumbTrail = readonly PageId[];

export type BreadcrumbItem = {
  id: PageId;
  label: string;
  href: string;
};

export type PageHead = {
  breadcrumbs: BreadcrumbTrail;
};

/* -------------------------------------------------------------------------- */
/* Page content                                                                */
/* -------------------------------------------------------------------------- */

export type PageContentHero = {
  title: string;
  intro: string;
  eyebrow: string;
};

export type PageContent = {
  head: PageContentHero;
  body: readonly string[];
  footer: readonly string[];
};

/* -------------------------------------------------------------------------- */
/* Document footer assets and metadata                                         */
/* -------------------------------------------------------------------------- */

export type PageDocumentFooter = {
  scripts: readonly ScriptAsset[];
  svgs: readonly SvgAsset[];
  structuredData: readonly StructuredDataNode[];
};

/* -------------------------------------------------------------------------- */
/* Final authored page definition                                              */
/* -------------------------------------------------------------------------- */

export type PageDefinition = {
  core: PageDefinitionCore;
  config: PageDefinitionConfig;
  docHead: PageDocumentHead;
  pageHead: PageHead;
  content: PageContent;
  docFooter: PageDocumentFooter;
};
