// src/app-render-context/resolve/structured-data.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextStructuredDataEntry } from "@shared-types/structured-data/app-render-context.structured-data.types";

import { resolveBreadcrumbsStructuredDataAppRenderContext } from "@app-render-context/resolve/doc-close/breadcrumbs.structured-data.resolve.app-render-context";

type resolveStructuredDataAppRenderContextContext = Readonly<{
  origin: string;
}>;

export const resolveStructuredDataAppRenderContext = (
  appContext: AppContext,
  context: resolveStructuredDataAppRenderContextContext,
): readonly AppRenderContextStructuredDataEntry[] => {
  const breadcrumbs = resolveBreadcrumbsStructuredDataAppRenderContext(
    appContext,
    context.origin,
  );

  return [
    ...appContext.structuredData.map((entry) => entry.json),
    ...(breadcrumbs ? [breadcrumbs] : []),
  ];
};
