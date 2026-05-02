// src/app-context/resolve/page/content/shared/pagination.resolve.app-context.ts

import type { AppContextPagination } from "@shared-types/page-content/shared/pagination/app-context.pagination.page-content.types";
import type { AppStatePagination } from "@shared-types/page-content/shared/pagination/app-state.pagination.page-content.types";

type ResolvePaginationAppContextArgs = Readonly<{
  pagination: AppStatePagination;
  currentPage: number;
  totalItems: number;
  baseHref: string;
}>;

const buildPageHref = (baseHref: string, page: number): string =>
  page === 1 ? baseHref : `${baseHref}/page-${page}`;

export const resolvePaginationAppContext = ({
  pagination,
  currentPage,
  totalItems,
  baseHref,
}: ResolvePaginationAppContextArgs): AppContextPagination => {
  const pageSize = pagination.pageSize;
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    pageSize,
    currentPage,
    totalItems,
    totalPages,
    previousHref:
      currentPage > 1 ? buildPageHref(baseHref, currentPage - 1) : null,
    nextHref:
      currentPage < totalPages
        ? buildPageHref(baseHref, currentPage + 1)
        : null,
  };
};
