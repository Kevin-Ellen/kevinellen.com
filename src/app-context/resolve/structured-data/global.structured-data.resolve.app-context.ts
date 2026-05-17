// src/app-context/resolve/structured-data/global.structured-data.resolve.app-context.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppContextStructuredDataEntry } from "@shared-types/structured-data/app-context.structured-data.types";

import { appContextResolveWebsiteStructuredData } from "@app-context/resolve/structured-data/website.structured-data.global.resolve.app-context";

export const appContextResolveGlobalStructuredData = (
  appState: AppState,
): readonly AppContextStructuredDataEntry[] => {
  return [
    appContextResolveWebsiteStructuredData(
      appState.structuredData.website,
      appState,
    ),
  ];
};
