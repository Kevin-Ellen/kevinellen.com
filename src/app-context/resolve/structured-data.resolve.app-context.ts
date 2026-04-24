// src/app-context/resolve/structured-data.resolve.app-context.ts

import type { AppContextStructuredDataEntry } from "@shared-types/structured-data/app-context.structured-data.types";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";
import type { AppState } from "@app-state/class.app-state";

import { resolveGlobalStructuredDataAppContext } from "@app-context/resolve/structured-data/global.structured-data.global.resolve.app-context";

export const resolveStructuredDataAppContext = (
  appState: AppState,
  page: AppStatePageDefinition,
): readonly AppContextStructuredDataEntry[] => {
  if (page.status !== null) {
    return [];
  }

  return [
    ...resolveGlobalStructuredDataAppContext(appState),
    ...page.structuredData,
  ];
};
