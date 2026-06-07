// shared-types/config/structured-data/app-state.website.structured-data.types.ts

import type { SiteLanguage } from "@shared-types/language/language.types";
import type { AppStateStructuredDataPageReference } from "@shared-types/config/structured-data/app-state.structured-data-reference.types";

export type AppStateWebSiteStructuredData = Readonly<{
  id: AppStateStructuredDataPageReference;
  url: AppStateStructuredDataPageReference;
  name: string;
  description: string;
  inLanguage: SiteLanguage;
  publisherId: AppStateStructuredDataPageReference;
}>;
