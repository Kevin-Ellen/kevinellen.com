// src/app/rendering/document/structured-data/build.structured-data.document.rendering.ts

import type { AppState } from "@app/appState/appState";
import type { StructuredDataNode } from "@app/config/structuredData.config.types";
import type {
  BreadcrumbItem,
  PageDefinition,
} from "@app/pages/page.definition";

import { resolveBreadcrumbs } from "@src/app/rendering/document/breadcrumbs/resolve.breadcrumbs.document.rendering";

export const buildStructuredData = (
  appState: AppState,
  page: PageDefinition,
): readonly StructuredDataNode[] => {
  const structuredData: StructuredDataNode[] = [
    ...page.docFooter.structuredData,
  ];

  if (page.core.kind === "error") {
    return Object.freeze(structuredData);
  }

  const breadcrumbItems = resolveBreadcrumbs(appState, page);

  if (breadcrumbItems.length > 0) {
    structuredData.push(
      buildBreadcrumbStructuredData(
        appState.siteConfig.siteUrl,
        breadcrumbItems,
      ),
    );
  }

  return Object.freeze(structuredData);
};

const buildBreadcrumbStructuredData = (
  siteUrl: string,
  breadcrumbItems: readonly BreadcrumbItem[],
): StructuredDataNode => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.label,
      item: buildAbsoluteUrl(siteUrl, breadcrumb.href),
    })),
  };
};

const buildAbsoluteUrl = (siteUrl: string, href: string): string => {
  return new URL(href, siteUrl).toString();
};
