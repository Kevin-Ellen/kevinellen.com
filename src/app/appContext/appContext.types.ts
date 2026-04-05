// src/app/appContext/appContext.types.ts

import type { Person, WebSite, WithContext } from "schema-dts";

import type { DocumentRenderTarget } from "@app/request/request.document.types";
import type { PageId } from "@shared-types/pages/page.definition";
import type { Content } from "@app/content/content.types";
import type {
  ScriptAssetConfig,
  SvgAssetConfig,
  SvgAssetId,
} from "@shared-types/config/assets.config.types";
import type { PageStructuredDataDocument } from "@shared-types/config/structured-data.config.types";
import type { SiteConfig } from "@config/site.config.types";
import type { SocialId } from "@config/social.config.types";

export type AppContextBreadcrumb = {
  id: PageId;
  label: string;
  href: string;
};

export type AppContextHeaderBranding = {
  href: string;
  ariaLabel: string;
  logoSvgId: SvgAssetId;
};

export type AppContextBranding = {
  header: AppContextHeaderBranding;
};

export type AppContextNavigationItem =
  | {
      kind: "page";
      id: PageId;
      label: string;
      href: string;
      svgIconId?: SvgAssetId;
      isCurrent: boolean;
    }
  | {
      kind: "social";
      id: SocialId;
      label: string;
      href: string;
      svgIconId?: SvgAssetId;
      isCurrent: false;
    }
  | {
      kind: "external";
      label: string;
      href: string;
      svgIconId?: SvgAssetId;
      isCurrent: false;
    };

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
  scripts: readonly ScriptAssetConfig[];
  svgs: readonly SvgAssetConfig[];
};

export type AppContextStructuredData = {
  person: WithContext<Person>;
  website: WithContext<WebSite>;
  page: PageStructuredDataDocument | null;
};

export type AppContextCanonicalUrl = string | null;

export type AppContextSecurity = {
  nonce: string;
};

export type AppContextFooterAffiliation = {
  id: string;
  label: string;
  href: string;
  svgId: SvgAssetId;
};

export type AppContextFooterColophon = {
  copyrightName: string;
  copyrightYear: number;
};

export type AppContextFooter = {
  affiliations: {
    title: string;
    description: string;
    items: readonly AppContextFooterAffiliation[];
  } | null;
  colophon: AppContextFooterColophon | null;
};

export type AppContextConfig = {
  request: Request;
  security: AppContextSecurity;
  siteConfig: SiteConfig;
  canonicalUrl: AppContextCanonicalUrl;
  target: DocumentRenderTarget;
  breadcrumbs: readonly AppContextBreadcrumb[];
  navigation: AppContextNavigation;
  branding: AppContextBranding;
  assets: AppContextAssets;
  footer: AppContextFooter;
  structuredData: AppContextStructuredData;
  content: Content;
};
