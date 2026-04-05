// src/app/rendering/document/document.render.types.ts

import type { Content } from "@app/content/content.types";
import type { PageId } from "@shared-types/pages/definitions/base.definition.page";
import type { SocialId } from "@config/social.config.types";
import type { PageStructuredDataDocument } from "@shared-types/config/structured-data.config.types";
import type {
  ScriptAssetConfig,
  SvgAssetConfig,
  SvgAssetId,
} from "@shared-types/config/assets.config.types";
import type { Person, WebSite, WithContext } from "schema-dts";

export type DocumentRenderBreadcrumb = {
  id: PageId;
  label: string;
  href: string;
};

export type DocumentRenderHeaderLogo = {
  id: SvgAssetId;
  width: number;
  height: number;
  className: string;
};

export type DocumentRenderHeaderBranding = {
  href: string;
  ariaLabel: string;
  logo: DocumentRenderHeaderLogo;
};

export type DocumentRenderNavigationItem =
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

export type DocumentRenderPageHeader = {
  branding: DocumentRenderHeaderBranding;
  navigation: {
    primary: readonly DocumentRenderNavigationItem[];
    social: readonly DocumentRenderNavigationItem[];
  };
  breadcrumbs: readonly DocumentRenderBreadcrumb[];
};

export type DocumentRenderFooterNavigationItem = {
  label: string;
  href: string;
};

export type DocumentRenderFooterNavigationSection = {
  id: string;
  label: string;
  items: readonly DocumentRenderFooterNavigationItem[];
};

export type DocumentRenderFooterConservationOrganisation = {
  id: string;
  label: string;
  href: string;
  svgId: SvgAssetId;
  iconClassName: string;
  width: number;
  height: number;
};

export type DocumentRenderPageFooter = {
  navigation: {
    sections: readonly DocumentRenderFooterNavigationSection[];
  };
  conservation: {
    heading: string;
    intro: string;
    organisations: readonly DocumentRenderFooterConservationOrganisation[];
  };
  meta: {
    screenReaderHeading: string;
    copyright: string;
  };
};

export type DocumentRenderContext = {
  security: {
    nonce: string;
  };
  site: {
    language: string;
    siteName: string;
    siteUrl: string;
  };
  metadata: {
    canonicalUrl: string | null;
    pageTitle: string;
    metaDescription: string;
  };
  pageHeader: DocumentRenderPageHeader;
  content: Content;
  pageFooter: DocumentRenderPageFooter;
  structuredData: {
    person: WithContext<Person>;
    website: WithContext<WebSite>;
    page: PageStructuredDataDocument | null;
  };
  assets: {
    header: {
      scripts: readonly ScriptAssetConfig[];
    };
    footer: {
      scripts: readonly ScriptAssetConfig[];
      svgs: readonly SvgAssetConfig[];
    };
  };
};
