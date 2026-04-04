// src/app/pages/page.definition.ts

import type {
  SvgAssetConfig,
  ScriptAssetConfig,
} from "@config/assets.config.types";
import type { PageStructuredDataNode } from "@config/structured-data.config.types";
import type { PageContent } from "@app/pages/content/content.page.types";

/* -------------------------------------------------------------------------- */
/* Shared identity                                                            */
/* -------------------------------------------------------------------------- */

export type PageId = string;

export type PublicPageKind =
  | "home"
  | "static"
  | "listing"
  | "article"
  | "photo"
  | "tag";

export type ErrorPageStatus = 404 | 410 | 500;

/* -------------------------------------------------------------------------- */
/* Core definitions                                                           */
/* -------------------------------------------------------------------------- */

export type BasePageDefinitionCore = {
  id: PageId;
  label: string;
};

export type PublicPageDefinitionCore = BasePageDefinitionCore & {
  kind: PublicPageKind;
  slug: string;
};

export type ErrorPageDefinitionCore = BasePageDefinitionCore & {
  kind: "error";
  status: ErrorPageStatus;
};

/* -------------------------------------------------------------------------- */
/* Discoverability                                                            */
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

export type PublicPageDefinitionConfig = {
  robots: PageRobotsConfig;
  robotsTxt: PageRobotsTxtConfig;
  sitemap: PageSitemapConfig;
};

export type ErrorPageDefinitionConfig = {
  robots: PageRobotsConfig;
};

/* -------------------------------------------------------------------------- */
/* Page metadata                                                              */
/* -------------------------------------------------------------------------- */

export type PageMeta = {
  pageTitle: string;
  metaDescription: string;
};

/* -------------------------------------------------------------------------- */
/* Page navigation                                                            */
/* -------------------------------------------------------------------------- */

export type BreadcrumbTrail = readonly PageId[];

export type PageNavigation = {
  breadcrumbs: BreadcrumbTrail;
};

/* -------------------------------------------------------------------------- */
/* Page assets                                                                */
/* -------------------------------------------------------------------------- */

export type PageAssets = {
  scripts: readonly ScriptAssetConfig[];
  svgs: readonly SvgAssetConfig[];
};

/* -------------------------------------------------------------------------- */
/* Page structured data                                                       */
/* -------------------------------------------------------------------------- */

export type PageStructuredData = readonly PageStructuredDataNode[];

/* -------------------------------------------------------------------------- */
/* Shared authored page shape                                                 */
/* -------------------------------------------------------------------------- */

export type BasePageDefinition<TCore, TConfig> = {
  readonly core: TCore;
  readonly config: TConfig;
  readonly meta: PageMeta;
  readonly navigation: PageNavigation;
  readonly content: PageContent;
  readonly assets: PageAssets;
};

/* -------------------------------------------------------------------------- */
/* Specialised page definitions                                               */
/* -------------------------------------------------------------------------- */

export type PageDefinition = BasePageDefinition<
  PublicPageDefinitionCore,
  PublicPageDefinitionConfig
> & {
  readonly structuredData: PageStructuredData;
};

export type ErrorPageDefinition = BasePageDefinition<
  ErrorPageDefinitionCore,
  ErrorPageDefinitionConfig
>;
