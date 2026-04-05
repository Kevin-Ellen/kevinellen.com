// src/app/appState/appState.types.ts

import type { AssetsConfig } from "@shared-types/config/assets.config.types";
import type { StructuredDataConfig } from "@shared-types/config/structured-data.config.types";
import type { ErrorPageDefinition } from "@shared-types/pages/definitions/error.definition.page";
import type { PublicPageDefinition } from "@shared-types/pages/definitions/public.definition.page";
import type {
  ErrorPageStatus,
  PageId,
} from "@shared-types/pages/definitions/base.definition.page";

import type { FooterConfig } from "@config/footer.config.types";
import type { GoneRule } from "@config/gone.config.types";
import type { NavigationConfig } from "@config/navigation.config.types";
import type { RedirectRule } from "@config/redirects.config.types";
import type { SiteConfig } from "@config/site.config.types";
import type { SocialConfig } from "@config/social.config.types";
import type { WebManifestConfig } from "@config/webmanifest.config.types";

export type AppStatePublicPages = readonly PublicPageDefinition[];
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
  byId: ReadonlyMap<PageId, PublicPageDefinition>;
  bySlug: ReadonlyMap<string, PublicPageDefinition>;
};

export type AppStateErrorPageIndices = {
  byId: ReadonlyMap<PageId, ErrorPageDefinition>;
  byStatus: ReadonlyMap<ErrorPageStatus, ErrorPageDefinition>;
};

export type AppStatePageIndices = {
  publicPages: AppStatePublicPageIndices;
  errorPages: AppStateErrorPageIndices;
};

export type AppStatePageDefinition = PublicPageDefinition | ErrorPageDefinition;
