// shared-types/page-content/shared/pagination/app-render-context.pagination.shared.types.ts

import type { AppContextPagination } from "@shared-types/page-content/shared/pagination/app-context.pagination.shared.types";

type RuntimeFields = Readonly<{
  label: string;
  previousLabel: string;
  nextLabel: string;
}>;

export type AppRenderContextPagination = Readonly<
  AppContextPagination & RuntimeFields
>;
