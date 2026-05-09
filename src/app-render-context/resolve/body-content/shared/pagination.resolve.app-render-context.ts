// src/app-render-context/resolve/body-content/shared/pagination.resolve.app-render-context.ts

import type { AppContextPagination } from "@shared-types/page-content/shared/pagination/app-context.pagination.shared.types";
import type { AppRenderContextPagination } from "@shared-types/page-content/shared/pagination/app-render-context.pagination.shared.types";

export const appRenderContextResolvePagination = (
  pagination: AppContextPagination,
): AppRenderContextPagination => ({
  ...pagination,
  label: `Page ${pagination.currentPage} of ${pagination.totalPages}`,
  previousLabel: "← Newer entries",
  nextLabel: "Older entries →",
});
