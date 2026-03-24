// src/app/rendering/document/document.render.types.ts

import type { ScriptAsset } from "@app/assets/scripts/scripts.assets.types";
import type { SvgAsset } from "@app/assets/svgs/svgs.assets.types";
import type { StructuredDataNode } from "@app/config/structuredData.config.types";
import type { FooterSectionKind } from "@app/config/site.config.types";
import type {
  BreadcrumbItem,
  PageContent,
  PageId,
  PageKind,
  PageRenderMode,
  PageRobotsConfig,
} from "@app/pages/page.definition";

/* -------------------------------------------------------------------------- */
/* Security                                                                    */
/* -------------------------------------------------------------------------- */

export type DocumentRenderSecurity = {
  readonly nonce: string;
};

/* -------------------------------------------------------------------------- */
/* Site                                                                        */
/* -------------------------------------------------------------------------- */

export type DocumentRenderSite = {
  readonly language: string;
  readonly siteName: string;
  readonly siteUrl: string;
};

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export type DocumentRenderPage = {
  readonly id: PageId;
  readonly kind: PageKind;
  readonly slug: string;
  readonly renderMode: PageRenderMode;
};

/* -------------------------------------------------------------------------- */
/* SEO                                                                         */
/* -------------------------------------------------------------------------- */

export type DocumentRenderSeo = {
  readonly pageTitle: string;
  readonly metaDescription: string;
  readonly canonicalUrl: string;
};

/* -------------------------------------------------------------------------- */
/* Navigation                                                                  */
/* -------------------------------------------------------------------------- */

export type ResolvedNavItem = {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly isActive: boolean;
  readonly icon?: SvgAsset;
};

export type DocumentRenderHeaderNavigation = {
  readonly primary: readonly ResolvedNavItem[];
  readonly social: readonly ResolvedNavItem[];
};

export type ResolvedFooterSection = {
  readonly id: FooterSectionKind;
  readonly label: string;
  readonly items: readonly ResolvedNavItem[];
};

export type DocumentRenderFooterNavigation = {
  readonly sections: readonly ResolvedFooterSection[];
};

/* -------------------------------------------------------------------------- */
/* Page Head / Footer                                                          */
/* -------------------------------------------------------------------------- */

export type DocumentRenderPageHead = {
  readonly navigation: DocumentRenderHeaderNavigation;
  readonly breadcrumbs: readonly BreadcrumbItem[];
};

export type DocumentRenderPageFooter = {
  readonly navigation: DocumentRenderFooterNavigation;
};

/* -------------------------------------------------------------------------- */
/* Assets                                                                      */
/* -------------------------------------------------------------------------- */

export type DocumentRenderAssets = {
  readonly scripts: readonly ScriptAsset[];
  readonly svgs: readonly SvgAsset[];
};

/* -------------------------------------------------------------------------- */
/* Full render context                                                         */
/* -------------------------------------------------------------------------- */

export type DocumentRenderContext = {
  readonly security: DocumentRenderSecurity;
  readonly site: DocumentRenderSite;
  readonly page: DocumentRenderPage;
  readonly seo: DocumentRenderSeo;
  readonly pageHead: DocumentRenderPageHead;
  readonly pageFooter: DocumentRenderPageFooter;
  readonly content: PageContent;
  readonly assets: DocumentRenderAssets;
  readonly structuredData: readonly StructuredDataNode[];
  readonly robots: PageRobotsConfig;
};
