// src/app-context/resolve/structured-data.resolve.app-context.ts

import type { AppContextStructuredDataEntry } from "@shared-types/structured-data/app-context.structured-data.types";
import type { AppStatePublicPageDefinition } from "@shared-types/pages/definitions/public/app-state.public.definition.page.types";
import type { AppStateErrorPageDefinition } from "@shared-types/pages/definitions/error/app-state.base.error.definition.page.types";
import type { AppState } from "@app-state/class.app-state";

import { resolveGlobalStructuredDataAppContext } from "@app-context/resolve/structured-data/global.structured-data.global.resolve.app-context";

type AppStatePage = AppStatePublicPageDefinition | AppStateErrorPageDefinition;

export const resolveStructuredDataAppContext = (
  appState: AppState,
  page: AppStatePage,
): readonly AppContextStructuredDataEntry[] => {
  if ("status" in page) {
    return [];
  }

  return [
    ...resolveGlobalStructuredDataAppContext(appState),
    ...page.structuredData,
  ];
};
