// src/app-context/resolve/structured-data/website.structured-data.global.resolve.app-context.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppContextStructuredDataEntry } from "@shared-types/structured-data/app-context.structured-data.types";
import type { AppStateWebSiteStructuredData } from "@shared-types/config/structured-data/app-state.website.structured-data.types";

const resolveStructuredDataPageReferenceHref = (
  appState: AppState,
  reference: AppStateWebSiteStructuredData["id"],
): string => {
  const page = appState.getPublicPageById(reference.pageId);

  if (!page) {
    throw new Error(
      `Missing public page for structured data reference '${reference.pageId}'.`,
    );
  }

  return `${appState.siteConfig.origin}${page.slug}${reference.hash ?? ""}`;
};

export const resolveWebsiteStructuredDataGlobalAppContext = (
  structuredData: AppStateWebSiteStructuredData,
  appState: AppState,
): AppContextStructuredDataEntry => {
  return {
    id: "website",
    json: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": resolveStructuredDataPageReferenceHref(
        appState,
        structuredData.id,
      ),
      url: resolveStructuredDataPageReferenceHref(appState, structuredData.url),
      name: structuredData.name,
      description: structuredData.description,
      inLanguage: structuredData.inLanguage,
      publisher: {
        "@id": resolveStructuredDataPageReferenceHref(
          appState,
          structuredData.publisherId,
        ),
      },
    },
  };
};
