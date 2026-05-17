// src/app-state/resolve/pages/public/breadcrumbs.resolve.app-state.ts

import type { PageIdPublic } from "@shared-types/page-definitions/shared/shared.page-id.page-definition.types";

export const appStateResolvePageBreadcrumbs = (
  breadcrumbs: readonly PageIdPublic[] | undefined,
): readonly PageIdPublic[] => {
  return breadcrumbs ?? [];
};
