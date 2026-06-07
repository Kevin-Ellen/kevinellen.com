// shared-types/config/structured-data/app-state.structured-data.types.ts

import type { AppStateWebSiteStructuredData } from "@shared-types/config/structured-data/app-state.website.structured-data.types";
import type { AppStatePersonStructuredData } from "@shared-types/config/structured-data/app-state.person.structured-data.types";

export type AppStateStructuredData = Readonly<{
  website: AppStateWebSiteStructuredData;
  person: AppStatePersonStructuredData;
}>;
