// src/app-render-context/resolve/doc-close/breadcrumbs.structured-data.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";

export const resolveBreadcrumbsStructuredDataAppRenderContext = (
  appContext: AppContext,
  origin: string,
) => {
  if (
    appContext.breadcrumbs.items.length === 0 ||
    appContext.canonicalUrl === null
  ) {
    return null;
  }

  const itemListElement = [
    ...appContext.breadcrumbs.items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: item.text,
      item: new URL(item.href, origin).toString(),
    })),
    {
      "@type": "ListItem" as const,
      position: appContext.breadcrumbs.items.length + 1,
      name: appContext.breadcrumbs.current,
      item: appContext.canonicalUrl,
    },
  ];

  return {
    "@context": "https://schema.org" as const,
    "@type": "BreadcrumbList" as const,
    itemListElement,
  };
};
