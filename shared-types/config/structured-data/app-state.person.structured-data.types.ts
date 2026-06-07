// shared-types/config/structured-data/app-state.person.structured-data.types.ts

import type { AppStateStructuredDataPageReference } from "@shared-types/config/structured-data/app-state.structured-data-reference.types";

export type AppStatePersonStructuredData = Readonly<{
  id: AppStateStructuredDataPageReference;
  url: AppStateStructuredDataPageReference;
  name: string;
  description: string;
  jobTitle: string;
  knowsAbout: readonly string[];
  knowsLanguage: readonly string[];
  sameAs: readonly string[];
}>;
