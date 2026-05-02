// src/request/routing/resolve.public-route.request.ts

import type { AppState } from "@app-state/class.app-state";
import type { RoutingResult } from "@request/types/request.types";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";

const PAGINATED_ROUTE_PATTERN = /^(.+)\/page-([1-9]\d*)$/;

const getJournalListingPageSize = (
  page: AppStatePageDefinition,
): number | null => {
  for (const section of page.content.content) {
    if (section.kind !== "articleSection") {
      continue;
    }

    const journalListing = section.modules.find(
      (module) => module.kind === "journalListing",
    );

    if (journalListing?.kind === "journalListing") {
      return journalListing.pagination.pageSize;
    }
  }

  return null;
};

const getJournalPageCount = (appState: AppState): number =>
  appState.getPublicPages.filter((page) => page.kind === "journal").length;

const resolvePaginatedPublicRoute = (
  pathname: string,
  appState: AppState,
): RoutingResult | null => {
  const match = pathname.match(PAGINATED_ROUTE_PATTERN);

  if (match === null) {
    return null;
  }

  const [, basePathname, pageNumber] = match;
  const currentPage = Number(pageNumber);

  const page = appState.getPublicPageBySlug(basePathname);

  if (!page || page.kind !== "listing") {
    return {
      kind: "error",
      status: 404,
    };
  }

  if (currentPage === 1) {
    return {
      kind: "error",
      status: 404,
    };
  }

  const pageSize = getJournalListingPageSize(page);

  if (pageSize === null) {
    return {
      kind: "error",
      status: 404,
    };
  }

  const totalItems = getJournalPageCount(appState);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (currentPage > totalPages) {
    return {
      kind: "error",
      status: 404,
    };
  }

  return {
    kind: "found",
    publicPageId: page.id,
    pagination: {
      currentPage,
    },
  };
};

export const resolvePublicRoute = (
  pathname: string,
  appState: AppState,
): RoutingResult => {
  const paginatedRoute = resolvePaginatedPublicRoute(pathname, appState);

  if (paginatedRoute !== null) {
    return paginatedRoute;
  }

  const page = appState.getPublicPageBySlug(pathname);

  if (!page) {
    return {
      kind: "error",
      status: 404,
    };
  }

  return {
    kind: "found",
    publicPageId: page.id,
    pagination: page.kind === "listing" ? { currentPage: 1 } : null,
  };
};
