// src/app-render-context/resolve/structured-data.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextStructuredDataEntry } from "@shared-types/structured-data/app-render-context.structured-data.types";

export const resolveStructuredDataAppRenderContext = (
  appContext: AppContext,
): readonly AppRenderContextStructuredDataEntry[] => {
  return appContext.structuredData.map((entry) => entry.json);
};
