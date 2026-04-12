// shared-types/config/structured-data/app-state.website.structured-data.types.ts

import { PageIdPublic } from "@shared-types/pages/shared/id.shared.page.types";
import { SiteLanguage } from "@shared-types/language/language.types";

type StructuredDataPageReference = {
  pageId: PageIdPublic;
  hash?: string;
};

export type AppStateWebSiteStructuredData = {
  id: StructuredDataPageReference;
  url: StructuredDataPageReference;
  name: string;
  description: string;
  inLanguage: SiteLanguage;
  publisherId: StructuredDataPageReference;
};
