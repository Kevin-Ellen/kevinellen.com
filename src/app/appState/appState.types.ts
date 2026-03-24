// src/app/appState/appState.app.typests

import type { SiteConfig } from "@config/site.config.types";
import type { NavigationConfig } from "@config/navigation.config.types";
import type { SocialConfig } from "@config/social.config.types";
import type { StructuredDataConfig } from "@config/structured-data.config.types";
import type { AssetsConfig } from "@config/assets.config.types";
import type { FooterConfig } from "@config/footer.config.types";
import type { WebManifestConfig } from "@config/webmanifest.config.types";

import type {
  ErrorPageStatus,
  PageDefinition,
  ErrorPageDefinition,
  PageId,
} from "@app/pages/page.definition";

export type AppPagesSeed = {
  public: readonly PageDefinition[];
  error: readonly ErrorPageDefinition[];
};

export type AppStateSeed = {
  site: SiteConfig;
  navigation: NavigationConfig;
  social: SocialConfig;
  structuredData: StructuredDataConfig;
  assets: AssetsConfig;
  footer: FooterConfig;
  webmanifest: WebManifestConfig;
  pages: AppPagesSeed;
};

export type AppPagesState = {
  public: {
    all: readonly PageDefinition[];
    byId: ReadonlyMap<PageId, PageDefinition>;
    bySlug: ReadonlyMap<string, PageDefinition>;
  };
  error: {
    all: readonly ErrorPageDefinition[];
    byStatus: ReadonlyMap<ErrorPageStatus, ErrorPageDefinition>;
  };
};

export type AppStateData = {
  site: SiteConfig;
  navigation: NavigationConfig;
  social: SocialConfig;
  structuredData: StructuredDataConfig;
  assets: AssetsConfig;
  footer: FooterConfig;
  webmanifest: WebManifestConfig;
  pages: AppPagesState;
};
