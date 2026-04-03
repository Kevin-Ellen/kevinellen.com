// src/app/appContext/resolvers/structured-data.resolve.appContext.ts

import type { AppContextStructuredData } from "@app/appContext/appContext.types";
import type { AppState } from "@app/appState/class.appState";
import type { DocumentRenderTarget } from "@app/request/request.document.types";

import type { Person, WebSite, WithContext } from "schema-dts";

const resolvePersonStructuredDataAppContext = (
  appState: AppState,
): WithContext<Person> => {
  const person = appState.getStructuredDataConfig().person;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": person.id,
    url: person.url,
    name: person.name,
    jobTitle: person.jobTitle,
    description: person.description,
    address: {
      "@type": "PostalAddress",
      addressRegion: person.addressRegion,
      addressCountry: person.addressCountry,
    },
    knowsAbout: [...person.knowsAbout],
  };
};

const resolveWebsiteStructuredDataAppContext = (
  appState: AppState,
): WithContext<WebSite> => {
  const website = appState.getStructuredDataConfig().website;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": website.id,
    url: website.url,
    name: website.name,
    description: website.description,
    inLanguage: website.inLanguage,
    publisher: {
      "@id": website.publisherId,
    },
  };
};

const resolvePageStructuredDataAppContext = (target: DocumentRenderTarget) => {
  if (target.kind !== "page") {
    return null;
  }

  return target.page.structuredData;
};

export const resolveStructuredDataAppContext = (
  appState: AppState,
  target: DocumentRenderTarget,
): AppContextStructuredData => {
  return {
    person: resolvePersonStructuredDataAppContext(appState),
    website: resolveWebsiteStructuredDataAppContext(appState),
    page: resolvePageStructuredDataAppContext(target),
  };
};
