// src/app-render-context/resolve/body-header/breadcrumbs.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextBreadcrumbs } from "@shared-types/breadcrumbs/app-render-context.breadcrumbs.types";

import { resolveInternalLinkAppRenderContext } from "@app-render-context/shared/internal.link.resolve.app-render-context";

export const resolveBreadcrumbsAppRenderContext = (
  appContext: AppContext,
): AppRenderContextBreadcrumbs => {
  return {
    items: appContext.breadcrumbs.items.map((item) =>
      resolveInternalLinkAppRenderContext(item),
    ),
    current: appContext.breadcrumbs.current,
  };
};
