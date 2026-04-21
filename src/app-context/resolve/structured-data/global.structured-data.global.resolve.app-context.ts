// src/app-context/resolve/structured-data/global.structured-data.global.resolve.app-context.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppContextStructuredDataEntry } from "@shared-types/structured-data/app-context.structured-data.types";

import { resolveWebsiteStructuredDataGlobalAppContext } from "@app-context/resolve/structured-data/website.structured-data.global.resolve.app-context";

export const resolveGlobalStructuredDataAppContext = (
  appState: AppState,
): readonly AppContextStructuredDataEntry[] => {
  return [
    resolveWebsiteStructuredDataGlobalAppContext(
      appState.structuredData.website,
      appState,
    ),
  ];
};
