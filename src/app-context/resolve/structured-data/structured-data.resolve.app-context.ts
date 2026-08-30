// src/app-context/resolve/structured-data/structured-data.resolve.app-context.ts

import type { AppContextStructuredDataEntry } from "@shared-types/structured-data/app-context.structured-data.types";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";
import type { AppState } from "@app-state/class.app-state";

import { appContextResolveConfiguredStructuredData } from "@app-context/resolve/structured-data/configured.structured-data.resolve.app-context";

export const appContextResolveStructuredData = (
  appState: AppState,
  page: AppStatePageDefinition,
): readonly AppContextStructuredDataEntry[] => {
  if (page.status !== null) {
    return [];
  }

  return [
    ...appContextResolveConfiguredStructuredData(appState, page),
    ...page.structuredData,
  ];
};
