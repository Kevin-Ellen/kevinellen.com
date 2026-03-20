// src/app/rendering/document/breadcrumbs/resolve.breadcrumbs.document.rendering.ts

import type { AppState } from "@app/appState/appState";
import type {
  BreadcrumbItem,
  BreadcrumbTrail,
  PageDefinition,
  PageId,
} from "@app/pages/page.definition";

export const resolveBreadcrumbs = (
  appState: AppState,
  page: PageDefinition,
): readonly BreadcrumbItem[] => {
  return resolveBreadcrumbTrail(appState, page.pageHead.breadcrumbs);
};

const resolveBreadcrumbTrail = (
  appState: AppState,
  breadcrumbTrail: BreadcrumbTrail,
): readonly BreadcrumbItem[] => {
  return breadcrumbTrail.map((pageId) => {
    const breadcrumbPage = getPageById(appState, pageId);

    return {
      id: breadcrumbPage.core.id,
      label: breadcrumbPage.core.label,
      href: breadcrumbPage.core.slug,
    };
  });
};

const getPageById = (appState: AppState, pageId: PageId): PageDefinition => {
  const matchedPage = appState.pages.all.find(
    (candidate) => candidate.core.id === pageId,
  );

  if (!matchedPage) {
    throw new Error(
      `Invariant violation: breadcrumb page "${pageId}" is not registered in AppState.`,
    );
  }

  return matchedPage;
};
