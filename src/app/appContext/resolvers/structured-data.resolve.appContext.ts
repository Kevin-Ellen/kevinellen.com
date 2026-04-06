// src/app/appContext/resolvers/structured-data.resolve.appContext.ts

import type { AppState } from "@app/appState/class.appState";
import type {
  AppContextBreadcrumb,
  AppContextStructuredDataItem,
} from "@app/appContext/appContext.types";
import type { PublicPage } from "@shared-types/content/pages/public/public.page.union";
import type {
  StructuredDataBreadcrumbListNode,
  StructuredDataPersonNode,
  StructuredDataWebSiteNode,
} from "@shared-types/structured-data/structured-data.nodes.types";

const buildPersonStructuredDataNode = (
  appState: AppState,
): StructuredDataPersonNode => {
  const { person } = appState.config.structuredData;

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

const buildWebSiteStructuredDataNode = (
  appState: AppState,
): StructuredDataWebSiteNode => {
  const { website } = appState.config.structuredData;

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

const buildBreadcrumbStructuredDataNode = (
  breadcrumbs: readonly AppContextBreadcrumb[],
): StructuredDataBreadcrumbListNode => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.label,
      item: breadcrumb.href,
    })),
  };
};

const resolvePageStructuredDataItems = (
  page: PublicPage,
): readonly AppContextStructuredDataItem[] => {
  return page.structuredData ?? [];
};

export const resolveStructuredDataAppContext = (
  appState: AppState,
  page: PublicPage,
  breadcrumbs: readonly AppContextBreadcrumb[],
): readonly AppContextStructuredDataItem[] => {
  const items: AppContextStructuredDataItem[] = [
    buildPersonStructuredDataNode(appState),
    buildWebSiteStructuredDataNode(appState),
    ...resolvePageStructuredDataItems(page),
  ];

  if (breadcrumbs.length > 0) {
    items.push(buildBreadcrumbStructuredDataNode(breadcrumbs));
  }

  return items;
};
