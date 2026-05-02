// shared-types/page-content/shared/pagination/app-render-context.pagination.page-content.types.ts

import type { AppContextPagination } from "@shared-types/page-content/shared/pagination/app-context.pagination.page-content.types";

type AppRenderContextPaginationRuntime = Readonly<{
  label: string;
  previousLabel: string;
  nextLabel: string;
}>;

export type AppRenderContextPagination = Readonly<
  AppContextPagination & AppRenderContextPaginationRuntime
>;
