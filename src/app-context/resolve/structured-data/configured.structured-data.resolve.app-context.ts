// src/app-context/resolve/structured-data/configured.structured-data.resolve.app-context.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";
import type { AppContextStructuredDataEntry } from "@shared-types/structured-data/app-context.structured-data.types";

import { appContextResolveWebsiteStructuredData } from "@app-context/resolve/structured-data/website.structured-data.resolve.app-context";
import { appContextResolvePersonStructuredData } from "@app-context/resolve/structured-data/person.structured-data.resolve.app-context";

export const appContextResolveConfiguredStructuredData = (
  appState: AppState,
  page: AppStatePageDefinition,
): readonly AppContextStructuredDataEntry[] => {
  const entries: AppContextStructuredDataEntry[] = [];

  if (page.id === appState.structuredData.website.id.pageId) {
    entries.push(
      appContextResolveWebsiteStructuredData(
        appState.structuredData.website,
        appState,
      ),
    );
  }

  if (page.id === appState.structuredData.person.id.pageId) {
    entries.push(
      appContextResolvePersonStructuredData(
        appState.structuredData.person,
        appState,
      ),
    );
  }

  return entries;
};
