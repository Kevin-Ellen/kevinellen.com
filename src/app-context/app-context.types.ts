// src/app-context/app-context.types.ts

import type { AppContextNavigation } from "@shared-types/config/navigation/app-context.navigation.types";
import type { AppContextGlobalFooter } from "@shared-types/page-content/site/global-footer/app-context.global-footer.page-content.types";
import type { AppContextAssets } from "@shared-types/assets/app-context.assets.types";
import type { AppContextStructuredDataEntry } from "@shared-types/structured-data/app-context.structured-data.types";
import type { AppContextBreadcrumbs } from "@shared-types/breadcrumbs/app-context.breadcrumbs.types";
import type { AppContextPageDefinition } from "@shared-types/page-definitions/app-context.page-definition.types";
import type { PageMetadata } from "@shared-types/page-definitions/shared/shared.metadata.page-definition.types";
import type { AppStatePageRobotsDirectives } from "@shared-types/page-definitions/robots/app-state.robots.page-definition.types";
import type { SiteLanguage } from "@shared-types/language/language.types";
import type { AppContextHeadAssets } from "@shared-types/config/site-config/app-context.head-assets.config.types";
import type { AppContextThemeColour } from "@shared-types/config/webmanifest/app-context.theme-colour.webmanifest.types";
import type { AppContextHeaderBranding } from "@shared-types/config/site-config/app-context.header-branding.config.types";
import type { AppContextPreload } from "@shared-types/config/site-config/app-context.preload.config.types";

export type AppContextDocument = Readonly<{
  metadata: PageMetadata;
  language: SiteLanguage;
  origin: string;
  slug: string | null;
  canonicalUrl: string | null;
}>;

export type AppContextResponsePolicySource = Readonly<{
  robots: AppStatePageRobotsDirectives | null;
}>;

export type AppContextData = Readonly<{
  navigation: AppContextNavigation;
  globalFooter: AppContextGlobalFooter;
  assets: AppContextAssets;
  structuredData: readonly AppContextStructuredDataEntry[];
  breadcrumbs: AppContextBreadcrumbs;
  page: AppContextPageDefinition;
  metadata: PageMetadata;
  robots: AppStatePageRobotsDirectives | null;
  canonicalUrl: string | null;
  language: SiteLanguage;
  headAssets: AppContextHeadAssets;
  preload: AppContextPreload;
  themeColour: AppContextThemeColour;
  headerBranding: AppContextHeaderBranding;
}>;
