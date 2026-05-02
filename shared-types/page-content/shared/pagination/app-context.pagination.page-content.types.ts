// shared-types/page-content/shared/pagination/app-context.pagination.page-content.types.ts

import type { AppStatePagination } from "@shared-types/page-content/shared/pagination/app-state.pagination.page-content.types";

type AppContextPaginationRuntimeFields = Readonly<{
  currentPage: number;
  totalItems: number;
  totalPages: number;
  previousHref: string | null;
  nextHref: string | null;
}>;

export type AppContextPagination = Readonly<
  AppStatePagination & AppContextPaginationRuntimeFields
>;
