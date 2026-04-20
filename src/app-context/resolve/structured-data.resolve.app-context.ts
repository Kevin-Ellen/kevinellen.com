// src/app-context/resolve/structured-data.resolve.app-context.ts

import type { AppContextStructuredDataEntry } from "@shared-types/structured-data/app-context.structured-data.types";
import type { AppContextErrorPageDefinition } from "@shared-types/pages/definitions/error/app-context.base.error.definition.page.types";
import type { AppContextPublicPageDefinition } from "@shared-types/pages/definitions/public/app-context.public.definition.page.types";
import type { AppState } from "@app-state/class.app-state";

import { resolveGlobalStructuredDataAppContext } from "@app-context/resolve/structured-data/global.structured-data.global.resolve.app-context";

type AppContextPage =
  | AppContextPublicPageDefinition
  | AppContextErrorPageDefinition;

export const resolveStructuredDataAppContext = (
  appState: AppState,
  page: AppContextPage,
): readonly AppContextStructuredDataEntry[] => {
  if ("status" in page) {
    return [];
  }

  return [
    ...resolveGlobalStructuredDataAppContext(appState),
    ...page.structuredData,
  ];
};
