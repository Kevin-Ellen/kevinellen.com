// src/app/builders/structuredData.builder.ts

import type { BreadcrumbList, ListItem, WithContext } from "schema-dts";
import type { Breadcrumbs } from "@types-src/appPage.types";

const buildBreadcrumbStructuredData = (
  breadcrumbs: Breadcrumbs,
  siteUrl: string,
): WithContext<BreadcrumbList> => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map<ListItem>((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.label,
      item: new URL(breadcrumb.href, siteUrl).toString(),
    })),
  };
};

export default buildBreadcrumbStructuredData;
