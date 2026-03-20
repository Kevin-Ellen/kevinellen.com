// src/app/rendering/document/document.render.types.ts

import type { ScriptAsset } from "@app/assets/scripts/scripts.assets.types";
import type { SvgAsset } from "@app/assets/svgs/svgs.assets.types";
import type { StructuredDataNode } from "@app/config/structuredData.config.types";
import type { SocialMediaLinks } from "@app/config/site.config.types";
import type {
  BreadcrumbItem,
  PageContent,
  PageId,
  PageKind,
  PageRenderMode,
} from "@app/pages/page.definition";

export type DocumentRenderSecurity = {
  nonce: string;
};

export type DocumentRenderSite = {
  language: string;
  siteName: string;
  siteUrl: string;
  socialMedia: SocialMediaLinks;
};

export type DocumentRenderPage = {
  id: PageId;
  kind: PageKind;
  slug: string;
  renderMode: PageRenderMode;
};

export type DocumentRenderSeo = {
  pageTitle: string;
  metaDescription: string;
  canonicalUrl: string;
};

export type DocumentRenderPageHead = {
  breadcrumbs: readonly BreadcrumbItem[];
};

export type DocumentRenderAssets = {
  scripts: readonly ScriptAsset[];
  svgs: readonly SvgAsset[];
};

export type DocumentRender = {
  security: DocumentRenderSecurity;
  site: DocumentRenderSite;
  page: DocumentRenderPage;
  seo: DocumentRenderSeo;
  pageHead: DocumentRenderPageHead;
  content: PageContent;
  assets: DocumentRenderAssets;
  structuredData: readonly StructuredDataNode[];
};
