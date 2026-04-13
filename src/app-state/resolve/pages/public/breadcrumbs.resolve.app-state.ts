// src/app-state/resolve/pages/public/breadcrumbs.resolve.app-state.ts

import type { PageIdPublic } from "@shared-types/pages/shared/id.shared.page.types";

export const appStateResolvePageBreadcrumbs = (
  breadcrumbs: readonly PageIdPublic[] | undefined,
): readonly PageIdPublic[] => {
  return breadcrumbs ?? [];
};
