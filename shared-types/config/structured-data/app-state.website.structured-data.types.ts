// shared-types/config/structured-data/app-state.website.structured-data.types.ts

import type { PageIdPublic } from "@shared-types/pages/shared/id.shared.page.types";
import type { SiteLanguage } from "@shared-types/language/language.types";

type AppStateStructuredDataPageReference = Readonly<{
  pageId: PageIdPublic;
  hash?: string;
}>;

export type AppStateWebSiteStructuredData = Readonly<{
  id: AppStateStructuredDataPageReference;
  url: AppStateStructuredDataPageReference;
  name: string;
  description: string;
  inLanguage: SiteLanguage;
  publisherId: AppStateStructuredDataPageReference;
}>;
