// src/app/life-cycle/app-resolve/resolvers/structured-data/derived/breadcrumbs/breadcrumbs.derived.structured-data.resolver.app-resolve.ts

import type { BreadcrumbList } from "schema-dts";

import type { ContentAppResolve } from "../../../../../../types/document/page/content/content.page.document.app-resolve.type";
import type { SiteConfigAppResolve } from "../../../../../../types/config/site.config.app-resolve.type";

type Input = Readonly<{
  breadcrumbs: ContentAppResolve["breadcrumbs"];
  canonicalDomain: SiteConfigAppResolve["canonicalDomain"];
}>;

export const resolveBreadcrumbsDerivedStructuredDataAppResolve = ({
  breadcrumbs,
  canonicalDomain,
}: Input): BreadcrumbList => ({
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbs.map((breadcrumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: breadcrumb.label ?? "",
    item: new URL(breadcrumb.href, canonicalDomain).toString(),
  })),
});
