// src/app/appContext/appContext.types.ts

import type { DocumentRenderTarget } from "@app/request/request.document.types";
import type { ScriptAssetAuthored } from "@shared-types/assets/script.asset.authored.types";
import type { SvgAssetAuthored } from "@shared-types/assets/svg.asset.authored.types";
import type { SvgAssetId } from "@shared-types/assets/id.asset.types";
import type { StructuredDataNode } from "@shared-types/structured-data/structured-data.nodes.types";

export type AppContextSvgReference = {
  type: "inline-svg";
  id: string;
};

export type AppContextRequest = {
  url: string;
  method: string;
  pathname: string;
};

export type AppContextPage = {
  id: string;
  kind: string;
  label: string;
};

export type AppContextMetadata = {
  title: string;
  description: string;
  canonicalUrl: string | null;
};

export type AppContextBreadcrumb = {
  id: string;
  label: string;
  href: string;
};

export type AppContextBranding = {
  homeHref: string;
  ariaLabel: string;
  logo: AppContextSvgReference;
};

export type AppContextSiteIdentity = {
  language: string;
  siteName: string;
};

type AppContextNavigationItemBase = {
  label: string;
  href: string;
  icon?: AppContextSvgReference;
};

export type AppContextNavigationPageItem = AppContextNavigationItemBase & {
  kind: "page";
  id: string;
  isCurrent: boolean;
};

export type AppContextNavigationSocialItem = AppContextNavigationItemBase & {
  kind: "social";
  id: string;
  isCurrent: false;
};

export type AppContextNavigationExternalItem = AppContextNavigationItemBase & {
  kind: "external";
  isCurrent: false;
};

export type AppContextNavigationItem =
  | AppContextNavigationPageItem
  | AppContextNavigationSocialItem
  | AppContextNavigationExternalItem;

export type AppContextFooterNavigationSection = {
  id: string;
  label: string;
  items: readonly AppContextNavigationItem[];
};

export type AppContextNavigation = {
  header: {
    primary: readonly AppContextNavigationItem[];
    social: readonly AppContextNavigationItem[];
  };
  footer: {
    sections: readonly AppContextFooterNavigationSection[];
  };
};

export type AppContextAssets = {
  scripts: readonly ScriptAssetAuthored[];
  svgs: readonly SvgAssetAuthored[];
};

export type AppContextFooterOrganisation = {
  href: string;
  label: string;
  iconClassName: string;
  svgId: string;
};

export type AppContextFooterColophonModule = {
  kind: "colophon";
  copyrightName: string;
  copyrightYear: number;
};

export type AppContextFooterAffiliationItem = {
  id: string;
  label: string;
  href: string;
  svgId: SvgAssetId;
};

export type AppContextFooterAffiliationsModule = {
  kind: "affiliations";
  title: string;
  description: string;
  items: readonly AppContextFooterAffiliationItem[];
};

export type AppContextFooterModule =
  | AppContextFooterColophonModule
  | AppContextFooterAffiliationsModule;

export type AppContextPageFooter = {
  modules: readonly AppContextFooterModule[];
};

export type AppContextStructuredDataItem = StructuredDataNode;

export type AppContextModel = {
  request: AppContextRequest;
  target: DocumentRenderTarget;
  page: AppContextPage;
  metadata: AppContextMetadata;
  breadcrumbs: readonly AppContextBreadcrumb[];
  navigation: AppContextNavigation;
  branding: AppContextBranding;
  siteIdentity: AppContextSiteIdentity;
  assets: AppContextAssets;
  pageFooter: AppContextPageFooter;
  structuredData: readonly AppContextStructuredDataItem[];
};
