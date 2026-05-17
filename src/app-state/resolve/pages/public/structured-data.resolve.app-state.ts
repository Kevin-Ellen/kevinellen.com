// src/app-state/resolve/pages/public/structured-data.resolve.app-state.ts

import type { AuthoredStructuredDataEntry } from "@shared-types/structured-data/authored.structured-data.types";
import type { AppStateStructuredDataEntry } from "@shared-types/structured-data/app-state.structured-data.types";

export const appStateResolvePageStructuredData = (
  structuredData: readonly AuthoredStructuredDataEntry[] | undefined,
): readonly AppStateStructuredDataEntry[] => {
  return structuredData ?? [];
};
