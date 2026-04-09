// src/app/appState/appState.types.ts

import type { AssetsConfig } from "@app/config/assets.config.types";
import type { FooterConfig } from "@app/config/footer.config.types";
import type { GoneConfig } from "@app/config/gone.config.types";
import type { NavigationConfig } from "@app/config/navigation.config.types";
import type { RedirectsConfig } from "@app/config/redirects.config.types";
import type { SiteConfig } from "@app/config/site.config.types";
import type { SocialConfig } from "@app/config/social.config.types";
import type { StructuredDataConfig } from "@app/config/structured-data.config.types";
import type { WebManifestConfig } from "@app/config/webmanifest.config.types";
import type { PhotoMetadataConfig } from "@app/config/metadata.photo.config.types";

import type { PublicPage } from "@shared-types/content/pages/public/public.page.union";
import type { ErrorPageStatus } from "@shared-types/content/pages/error/error.page.definition";
import type { ErrorPage } from "@shared-types/content/pages/error/error.page.union";

export type AppConfig = {
  assets: AssetsConfig;
  footer: FooterConfig;
  gone: GoneConfig;
  navigation: NavigationConfig;
  redirects: RedirectsConfig;
  site: SiteConfig;
  social: SocialConfig;
  structuredData: StructuredDataConfig;
  webManifest: WebManifestConfig;
  photoMetadata: PhotoMetadataConfig;
};

export type AppPagesState = {
  public: readonly PublicPage[];
  error: readonly ErrorPage[];
  publicById: ReadonlyMap<string, PublicPage>;
  publicBySlug: ReadonlyMap<string, PublicPage>;
  errorByStatus: ReadonlyMap<ErrorPageStatus, ErrorPage>;
};

export type AppStateInput = {
  config: AppConfig;
  pages: AppPagesState;
};
