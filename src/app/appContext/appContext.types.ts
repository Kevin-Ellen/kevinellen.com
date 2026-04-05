// src/app/appContext/appContext.types.ts

import type { DocumentRenderTarget } from "@app/request/request.document.types";
import type { PublicPage } from "@shared-types/content/pages/public/public.page.union";
import type { ErrorPage } from "@shared-types/content/pages/error/error.page.union";
import { SiteConfig } from "@app/config/site.config.types";

export type AppContextPage = PublicPage | ErrorPage;

export type AppContextRequest = {
  url: string;
  method: string;
  pathname: string;
};

export type AppContextMetadata = {
  canonicalUrl: string | null;
};

export type AppContextBreadcrumb = {
  id: string;
  label: string;
  href: string;
};

export type AppContextNavigationPageItem = {
  kind: "page";
  id: string;
  label: string;
  href: string;
  isCurrent: boolean;
  svgId?: string;
};

export type AppContextNavigationSocialItem = {
  kind: "social";
  id: string;
  label: string;
  href: string;
  isCurrent: false;
  svgId?: string;
};

export type AppContextNavigationExternalItem = {
  kind: "external";
  label: string;
  href: string;
  isCurrent: false;
  svgId?: string;
};

export type AppContextNavigationItem =
  | AppContextNavigationPageItem
  | AppContextNavigationSocialItem
  | AppContextNavigationExternalItem;

export type AppContextNavigation = {
  header: {
    primary: readonly AppContextNavigationItem[];
    social: readonly AppContextNavigationItem[];
  };
  footer: {
    sections: readonly AppContextFooterNavigationSection[];
  };
};

export type AppContextFooterNavigationSection = {
  id: string;
  label: string;
  items: readonly AppContextNavigationItem[];
};

export type AppContextInput = {
  request: AppContextRequest;
  target: DocumentRenderTarget;
  page: AppContextPage;
  metadata: AppContextMetadata;
  breadcrumbs: readonly AppContextBreadcrumb[];
  navigation: AppContextNavigation;
  site: SiteConfig;
};

export type AppContextInspect = {
  request: AppContextRequest;
  target: {
    kind: DocumentRenderTarget["kind"];
    status: number;
    page: {
      id: string;
      kind: AppContextPage["core"]["kind"];
      label: string;
    };
  };
  page: {
    id: string;
    kind: AppContextPage["core"]["kind"];
    label: string;
  };
  metadata: AppContextMetadata;
  breadcrumbs: readonly AppContextBreadcrumb[];
  navigation: AppContextNavigation;
  site: SiteConfig;
};
