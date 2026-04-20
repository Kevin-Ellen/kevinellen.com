// src/app-context/app-context.types.ts

import type { AppContextNavigation } from "@shared-types/config/navigation/app-context.navigation.types";
import type { AppContextGlobalFooter } from "@shared-types/page-content/site/global-footer/app-context.global-footer.page-content.types";
import type { AppContextAssets } from "@shared-types/assets/app-context.assets.types";
import type { AppContextStructuredDataEntry } from "@shared-types/structured-data/app-context.structured-data.types";
// import type { AppContextPageDefinition } from "@shared-types/pages/definitions/app-context.definition.page.types";
import type { AppContextBreadcrumbs } from "@shared-types/breadcrumbs/app-context.breadcrumbs.types";

export type AppContextData = Readonly<{
  navigation: AppContextNavigation;
  globalFooter: AppContextGlobalFooter;
  // page: AppContextPageDefinition;
  assets: AppContextAssets;
  structuredData: readonly AppContextStructuredDataEntry[];
  breadcrumbs: AppContextBreadcrumbs;
}>;
