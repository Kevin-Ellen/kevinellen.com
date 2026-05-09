// src/app-render-context/resolve/body-header/breadcrumbs.body-header.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextBreadcrumbs } from "@shared-types/breadcrumbs/app-render-context.breadcrumbs.types";

import { appRenderContextResolveLink } from "@app-render-context/shared/link.resolve.app-render-context";

export const appRenderContextResolveBodyHeaderBreadcrumbs = (
  appContext: AppContext,
): AppRenderContextBreadcrumbs => {
  return {
    items: appContext.breadcrumbs.items.map((item) =>
      appRenderContextResolveLink(appContext, item),
    ),
    current: appContext.breadcrumbs.current,
  };
};
