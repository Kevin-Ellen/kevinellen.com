// src/app/appContext/appContext.types.ts

import type { Person, WebSite, WithContext } from "schema-dts";

import type { SiteConfig } from "@config/site.config.types";
import type {
  ScriptAssetConfig,
  SvgAssetConfig,
  SvgAssetId,
} from "@config/assets.config.types";
import type { DocumentRenderTarget } from "@app/request/request.document.types";
import type { PageId } from "@app/pages/page.definition";
import type { SocialId } from "@config/social.config.types";
import type { PageStructuredDataDocument } from "@config/structured-data.config.types";

export type AppContextBreadcrumb = {
  id: PageId;
  label: string;
  href: string;
};

export type AppContextNavigationItem =
  | {
      kind: "page";
      id: PageId;
      label: string;
      href: string;
      svgId?: SvgAssetId;
      isCurrent: boolean;
    }
  | {
      kind: "social";
      id: SocialId;
      label: string;
      href: string;
      svgId?: SvgAssetId;
      isCurrent: false;
    }
  | {
      kind: "external";
      label: string;
      href: string;
      svgId?: SvgAssetId;
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

export type AppContextContentInline =
  | {
      kind: "text";
      text: string;
    }
  | {
      kind: "internal-link";
      pageId: string;
      label: string;
      href: string;
    };

export type AppContextContentParagraph = {
  kind: "paragraph";
  inlines: readonly AppContextContentInline[];
};

export type AppContextContent = {
  head: {
    eyebrow: string;
    title: string;
    intro: string;
  };
  body: readonly AppContextContentParagraph[];
  footer: readonly string[];
};

export type AppContextSecurity = {
  nonce: string;
};

export type AppContextConfig = {
  request: Request;
  security: AppContextSecurity;
  siteConfig: SiteConfig;
  canonicalUrl: AppContextCanonicalUrl;
  target: DocumentRenderTarget;
  breadcrumbs: readonly AppContextBreadcrumb[];
  navigation: AppContextNavigation;
  assets: AppContextAssets;
  structuredData: AppContextStructuredData;
  content: AppContextContent;
};
