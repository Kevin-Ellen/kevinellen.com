// packages/shared-types/src/pages/definitions/base.definition.page.ts

import type {
  ScriptAssetConfig,
  SvgAssetConfig,
} from "../../config/assets.config.types";
import type { PageStructuredDataNode } from "../../config/structured-data.config.types";

/* -------------------------------------------------------------------------- */
/* Shared identity                                                            */
/* -------------------------------------------------------------------------- */

export type PageId = string;

export type StandardPublicPageKind = "home" | "static" | "listing" | "tag";

export type ErrorPageStatus = 404 | 410 | 500;

/* -------------------------------------------------------------------------- */
/* Core definitions                                                           */
/* -------------------------------------------------------------------------- */

export type BasePageDefinitionCore = {
  id: PageId;
  label: string;
};

export type StandardPageDefinitionCore = BasePageDefinitionCore & {
  kind: StandardPublicPageKind;
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

export type StandardPageDefinitionConfig = {
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

export type DatedPageMetadata = {
  datePublished: string | null;
  dateModified: string | null;
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

export type BasePageDefinition<TCore, TConfig, TContent> = {
  readonly core: TCore;
  readonly config: TConfig;
  readonly meta: PageMeta;
  readonly navigation: PageNavigation;
  readonly content: TContent;
  readonly assets: PageAssets;
};
