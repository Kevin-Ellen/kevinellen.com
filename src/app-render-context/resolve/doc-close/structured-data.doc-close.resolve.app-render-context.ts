// src/app-render-context/resolve/doc-close/structured-data.doc-close.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextStructuredDataEntry } from "@shared-types/structured-data/app-render-context.structured-data.types";

import { appRenderContextResolveDocCloseBreadcrumbsStructuredData } from "@app-render-context/resolve/doc-close/breadcrumbs.doc-close.resolve.app-render-context";

type resolveStructuredDataAppRenderContextContext = Readonly<{
  origin: string;
}>;

export const appRenderContextResolveDocCloseStructuredData = (
  appContext: AppContext,
  context: resolveStructuredDataAppRenderContextContext,
): readonly AppRenderContextStructuredDataEntry[] => {
  const breadcrumbs = appRenderContextResolveDocCloseBreadcrumbsStructuredData(
    appContext,
    context.origin,
  );

  return [
    ...appContext.structuredData.map((entry) => entry.json),
    ...(breadcrumbs ? [breadcrumbs] : []),
  ];
};
