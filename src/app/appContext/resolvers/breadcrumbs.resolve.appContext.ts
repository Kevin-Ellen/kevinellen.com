// src/app/appContext/resolvers/breadcrumbs.resolve.appContext.ts

import type {
  AppContextBreadcrumb,
  AppContextPage,
} from "@app/appContext/appContext.types";
import type { AppState } from "@app/appState/class.appState";

export const resolveBreadcrumbsAppContext = (
  appState: AppState,
  page: AppContextPage,
): readonly AppContextBreadcrumb[] => {
  if (!("slug" in page.core)) {
    return [];
  }

  const breadcrumbIds = page.breadcrumbs;

  return breadcrumbIds.map((breadcrumbId) => {
    const breadcrumbPage = appState.getPublicPageById(breadcrumbId);

    if (!breadcrumbPage) {
      throw new Error(`Breadcrumb page not found for id: ${breadcrumbId}`);
    }

    return {
      id: breadcrumbPage.core.id,
      label: breadcrumbPage.core.label,
      href: breadcrumbPage.core.slug,
    };
  });
};
