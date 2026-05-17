// shared-types/page-content/shared/pagination/app-context.pagination.shared.types.ts

import type { AppStatePagination } from "@shared-types/page-content/shared/pagination/app-state.pagination.shared.types";

type RuntimeFields = Readonly<{
  currentPage: number;
  totalItems: number;
  totalPages: number;
  previousHref: string | null;
  nextHref: string | null;
}>;

export type AppContextPagination = Readonly<AppStatePagination & RuntimeFields>;
