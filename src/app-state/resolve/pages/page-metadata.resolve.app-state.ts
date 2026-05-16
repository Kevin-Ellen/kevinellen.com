// src/app-state/resolve/pages/page-metadata.resolve.app-state.ts

import type { PageMetadata } from "@shared-types/page-definitions/shared/shared.metadata.page-definition.types";

const SITE_TITLE_SUFFIX = " | Kevin Ellen";

const resolvePageTitle = (title: string): string =>
  title.endsWith(SITE_TITLE_SUFFIX) ? title : `${title}${SITE_TITLE_SUFFIX}`;

export const appStateResolvePageMetadata = (
  metadata: PageMetadata,
): PageMetadata => ({
  ...metadata,
  pageTitle: resolvePageTitle(metadata.pageTitle),
});
