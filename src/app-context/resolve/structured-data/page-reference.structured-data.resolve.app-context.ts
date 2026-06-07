// src/app-context/resolve/structured-data/page-reference.structured-data.resolve.app-context.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppStateStructuredDataPageReference } from "@shared-types/config/structured-data/app-state.structured-data-reference.types";

export const resolveStructuredDataPageReferenceHref = (
  appState: AppState,
  reference: AppStateStructuredDataPageReference,
): string => {
  const page = appState.getPublicPageById(reference.pageId);

  if (!page) {
    throw new Error(
      `Missing public page for structured data reference '${reference.pageId}'.`,
    );
  }

  return `${appState.siteConfig.origin}${page.slug}${reference.hash ?? ""}`;
};
