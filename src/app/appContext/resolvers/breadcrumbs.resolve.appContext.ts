// src/app/appContext/resolvers/breadcrumbs.resolve.appContext.ts

import type { AppState } from "@app/appState/class.appState";
import type { AppContextBreadcrumb } from "@app/appContext/appContext.types";
import type { BreadcrumbTrail } from "@shared-types/pages/page.definition";

export const resolveBreadcrumbsAppContext = (
  breadcrumbIds: BreadcrumbTrail,
  appState: AppState,
): readonly AppContextBreadcrumb[] => {
  return breadcrumbIds.map((id) => {
    const page = appState.getPublicPageById(id);

    if (!page) {
      throw new Error(`Missing breadcrumb page for id: ${id}`);
    }

    return {
      id: page.core.id,
      label: page.core.label,
      href: page.core.slug,
    };
  });
};
