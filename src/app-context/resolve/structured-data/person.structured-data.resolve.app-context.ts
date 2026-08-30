// src/app-context/resolve/structured-data/person.structured-data.resolve.app-context.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppStatePersonStructuredData } from "@shared-types/config/structured-data/app-state.person.structured-data.types";
import type { AppContextStructuredDataEntry } from "@shared-types/structured-data/app-context.structured-data.types";

import { resolveStructuredDataPageReferenceHref } from "@app-context/resolve/structured-data/page-reference.structured-data.resolve.app-context";

export const appContextResolvePersonStructuredData = (
  structuredData: AppStatePersonStructuredData,
  appState: AppState,
): AppContextStructuredDataEntry => {
  const personId = resolveStructuredDataPageReferenceHref(
    appState,
    structuredData.id,
  );

  const personUrl = resolveStructuredDataPageReferenceHref(
    appState,
    structuredData.url,
  );

  return {
    id: "person",
    json: {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": personId,
      url: personUrl,
      name: structuredData.name,
      description: structuredData.description,
      jobTitle: structuredData.jobTitle,
      knowsAbout: structuredData.knowsAbout,
      knowsLanguage: structuredData.knowsLanguage,
      sameAs: structuredData.sameAs,
      mainEntityOfPage: {
        "@id": `${personUrl}#webpage`,
      },
    },
  };
};
