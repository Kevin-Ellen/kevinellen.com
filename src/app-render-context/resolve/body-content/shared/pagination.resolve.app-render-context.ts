// src/app-render-context/resolve/body-content/shared/pagination.resolve.app-render-context.ts

import type { AppContextPagination } from "@shared-types/page-content/shared/pagination/app-context.pagination.page-content.types";
import type { AppRenderContextPagination } from "@shared-types/page-content/shared/pagination/app-render-context.pagination.page-content.types";

export const resolvePaginationAppRenderContext = (
  pagination: AppContextPagination,
): AppRenderContextPagination => ({
  ...pagination,
  label: `Page ${pagination.currentPage} of ${pagination.totalPages}`,
  previousLabel: "← Newer entries",
  nextLabel: "Older entries →",
});
