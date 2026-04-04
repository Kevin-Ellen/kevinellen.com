// src/app/rendering/document/document.render.types.ts

import type { Content } from "@app/content/content.types";
import type { PageId } from "@shared-types/pages/page.definition";
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

export type DocumentRenderSvgIcon = {
  id: SvgAssetId;
  viewBox: string;
  width: number;
  height: number;
};

export type DocumentRenderNavigationItem =
  | {
      kind: "page";
      id: PageId;
      label: string;
      href: string;
      svgIcon?: DocumentRenderSvgIcon;
      isCurrent: boolean;
    }
  | {
      kind: "social";
      id: SocialId;
      label: string;
      href: string;
      svgIcon?: DocumentRenderSvgIcon;
      isCurrent: false;
    }
  | {
      kind: "external";
      label: string;
      href: string;
      svgIcon?: DocumentRenderSvgIcon;
      isCurrent: false;
    };

export type DocumentRenderHeaderNavigation = {
  primary: readonly DocumentRenderNavigationItem[];
  social: readonly DocumentRenderNavigationItem[];
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
  navigation: {
    header: DocumentRenderHeaderNavigation;
  };
  breadcrumbs: readonly DocumentRenderBreadcrumb[];
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
