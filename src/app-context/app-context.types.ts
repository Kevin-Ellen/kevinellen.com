// src/app-context/app-context.types.ts

import type { AppContextNavigation } from "@shared-types/config/navigation/app-context.navigation.types";
import type { AppContextGlobalFooter } from "@shared-types/page-content/site/global-footer/app-context.global-footer.page-content.types";
import type { AppContextAssets } from "@shared-types/assets/app-context.assets.types";
import type { AppContextStructuredDataEntry } from "@shared-types/structured-data/app-context.structured-data.types";
import type { AppContextPublicPageDefinition } from "@shared-types/pages/definitions/public/app-context.public.definition.page.types";
import type { AppContextErrorPageDefinition } from "@shared-types/pages/definitions/error/app-context.base.error.definition.page.types";
import type { AppContextBreadcrumbs } from "@shared-types/breadcrumbs/app-context.breadcrumbs.types";
import type { PageMetadata } from "@shared-types/pages/shared/metadata.shared.page.types";
import type { AppStatePageRobotsDirectives } from "@shared-types/pages/shared/app-state.robots.shared.page.types";
import type { SiteLanguage } from "@shared-types/language/language.types";
import type { AppContextHeadAssets } from "@shared-types/config/site-config/app-context.head-assets.config.types";
import type { AppContextThemeColour } from "@shared-types/config/webmanifest/app-context.theme-colour.webmanifest.types";

export type AppContextDocument = Readonly<{
  metadata?: PageMetadata;
  language: SiteLanguage;
  origin: string;
  slug: string;
  canonicalUrl: string;
}>;

export type AppContextResponsePolicySource = Readonly<{
  robots?: AppStatePageRobotsDirectives;
}>;

export type AppContextData = Readonly<{
  navigation: AppContextNavigation;
  globalFooter: AppContextGlobalFooter;
  assets: AppContextAssets;
  structuredData: readonly AppContextStructuredDataEntry[];
  breadcrumbs: AppContextBreadcrumbs;
  page: AppContextPublicPageDefinition | AppContextErrorPageDefinition;
  metadata?: PageMetadata;
  robots?: AppStatePageRobotsDirectives;
  canonicalUrl: string | null;
  language: SiteLanguage;
  headAssets: AppContextHeadAssets;
  themeColour: AppContextThemeColour;
}>;
