// src/app/appState/appState.types.ts

import type {
  PageDefinition,
  ErrorPageDefinition,
} from "@app/pages/page.definition";

import type { AssetsConfig } from "@config/assets.config.types";
import type { FooterConfig } from "@config/footer.config.types";
import type { NavigationConfig } from "@config/navigation.config.types";
import type { SiteConfig } from "@config/site.config.types";
import type { SocialConfig } from "@config/social.config.types";
import type { StructuredDataConfig } from "@config/structured-data.config.types";
import type { WebManifestConfig } from "@config/webmanifest.config.types";
import type { PageId, ErrorPageStatus } from "@app/pages/page.definition";
import type { RedirectRule } from "@config/redirects.config.types";
import type { GoneRule } from "@config/gone.config.types";

export type AppStatePublicPages = readonly PageDefinition[];
export type AppStateErrorPages = readonly ErrorPageDefinition[];

export type AppStatePages = {
  publicPages: AppStatePublicPages;
  errorPages: AppStateErrorPages;
};

export type AppStateConfig = {
  siteConfig: SiteConfig;
  assetsConfig: AssetsConfig;
  footerConfig: FooterConfig;
  navigationConfig: NavigationConfig;
  socialConfig: SocialConfig;
  structuredDataConfig: StructuredDataConfig;
  webManifestConfig: WebManifestConfig;
  pages: AppStatePages;
  redirectsConfig: readonly RedirectRule[];
  goneConfig: readonly GoneRule[];
};

export type AppStatePublicPageIndices = {
  byId: ReadonlyMap<PageId, PageDefinition>;
  bySlug: ReadonlyMap<string, PageDefinition>;
};

export type AppStateErrorPageIndices = {
  byId: ReadonlyMap<PageId, ErrorPageDefinition>;
  byStatus: ReadonlyMap<ErrorPageStatus, ErrorPageDefinition>;
};

export type AppStatePageIndices = {
  publicPages: AppStatePublicPageIndices;
  errorPages: AppStateErrorPageIndices;
};
