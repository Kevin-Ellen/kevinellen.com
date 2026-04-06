// src/app/renderContext/renderContext.types.ts

import type { ScriptAssetAuthored } from "@shared-types/assets/script.asset.authored.types";
import type { SvgAssetId } from "@shared-types/assets/id.asset.types";
import type { StructuredDataNode } from "@shared-types/structured-data/structured-data.nodes.types";
import type { RenderContextPageBodyContent } from "@app/renderContext/content/content.renderContext.types";

export type RenderContextSvgAsset = {
  id: SvgAssetId;
  viewBox: string;
  content: string;
  width: number;
  height: number;
};

export type RenderContextDocument = {
  status: number;
  language: string;
  siteName: string;
};

export type RenderContextPage = {
  id: string;
  kind: string;
  label: string;
};

export type RenderContextMetadata = {
  title: string;
  description: string;
  canonicalUrl: string | null;
};

export type RenderContextSecurity = {
  nonce: string;
};

export type RenderContextHead = {
  scripts: readonly ScriptAssetAuthored[];
};

export type RenderContextFooter = {
  scripts: readonly ScriptAssetAuthored[];
  svgs: readonly RenderContextSvgAsset[];
};

export type RenderContextStructuredData = {
  items: readonly StructuredDataNode[];
};

export type RenderContextSvgReference = {
  id: SvgAssetId;
  width: number;
  height: number;
};

export type RenderContextBreadcrumb = {
  id: string;
  label: string;
  href: string;
};

export type RenderContextNavigationItem = {
  kind: "page" | "social" | "external";
  id?: string;
  label: string;
  href: string;
  isCurrent: boolean;
  isExternal: boolean;
  openInNewTab: boolean;
  icon?: RenderContextSvgReference;
};

export type RenderContextHeaderBranding = {
  href: string;
  ariaLabel: string;
  logo: RenderContextSvgReference;
};

export type RenderContextHeader = {
  branding: RenderContextHeaderBranding;
  navigation: {
    primary: readonly RenderContextNavigationItem[];
    social: readonly RenderContextNavigationItem[];
  };
  breadcrumbs: readonly RenderContextBreadcrumb[];
};

export type RenderContextFooterNavigationItem = {
  label: string;
  href: string;
  isExternal: boolean;
  openInNewTab: boolean;
};

export type RenderContextFooterNavigationSection = {
  id: string;
  label: string;
  items: readonly RenderContextFooterNavigationItem[];
};

export type RenderContextPageFooterAffiliationItem = {
  href: string;
  label: string;
  svg: RenderContextSvgReference;
};

export type RenderContextPageFooter = {
  navigation: {
    sections: readonly RenderContextFooterNavigationSection[];
  };
  affiliations: {
    title: string;
    description: string;
    items: readonly RenderContextPageFooterAffiliationItem[];
  } | null;
  colophon: {
    copyright: string;
  } | null;
};

export type RenderContextModel = {
  document: RenderContextDocument;
  page: RenderContextPage;
  metadata: RenderContextMetadata;
  head: RenderContextHead;
  header: RenderContextHeader;
  pageFooter: RenderContextPageFooter;
  footer: RenderContextFooter;
  structuredData: RenderContextStructuredData;
  security: RenderContextSecurity;
  content: RenderContextPageBodyContent;
};
