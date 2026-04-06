// src/app/appContext/resolvers/breadcrumbs.resolve.appContext.ts

import type { AppContextBreadcrumb } from "@app/appContext/appContext.types";
import type { AppState } from "@app/appState/class.appState";
import type { PublicPage } from "@shared-types/content/pages/public/public.page.union";

export const resolveBreadcrumbsAppContext = (
  appState: AppState,
  page: PublicPage,
): readonly AppContextBreadcrumb[] => {
  return page.breadcrumbs.map((breadcrumbId) => {
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
