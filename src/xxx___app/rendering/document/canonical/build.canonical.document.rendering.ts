// src/app/rendering/document/canonical/build.canonical.document.rendering.ts

import type { AppState } from "@app/appState/appState";
import type { PageDefinition } from "@app/pages/page.definition";

export const buildCanonicalUrl = (
  appState: AppState,
  page: PageDefinition,
): string => {
  const siteUrl = appState.siteConfig.siteUrl;
  const pageSlug = page.core.slug;

  return new URL(pageSlug, siteUrl).toString();
};
