// src/app-render-context/resolve/doc-close/breadcrumbs.doc-close.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";

import { appRenderContextResolveDocCloseBreadcrumbsStructuredData } from "@app-render-context/resolve/doc-close/breadcrumbs.doc-close.resolve.app-render-context";

describe("appRenderContextResolveDocCloseBreadcrumbsStructuredData", () => {
  it("returns null when breadcrumbs are empty", () => {
    const appContext = {
      breadcrumbs: {
        items: [],
        current: "Current",
      },
      canonicalUrl: "https://kevinellen.com/current",
    } as unknown as AppContext;

    expect(
      appRenderContextResolveDocCloseBreadcrumbsStructuredData(
        appContext,
        "https://kevinellen.com",
      ),
    ).toBeNull();
  });

  it("returns null when canonical URL is missing", () => {
    const appContext = {
      breadcrumbs: {
        items: [{ text: "Journal", href: "/journal" }],
        current: "Current",
      },
      canonicalUrl: null,
    } as unknown as AppContext;

    expect(
      appRenderContextResolveDocCloseBreadcrumbsStructuredData(
        appContext,
        "https://kevinellen.com",
      ),
    ).toBeNull();
  });

  it("resolves breadcrumb structured data", () => {
    const appContext = {
      breadcrumbs: {
        items: [{ text: "Journal", href: "/journal" }],
        current: "Coot field notes",
      },
      canonicalUrl: "https://kevinellen.com/journal/coot-field-notes",
    } as unknown as AppContext;

    expect(
      appRenderContextResolveDocCloseBreadcrumbsStructuredData(
        appContext,
        "https://kevinellen.com",
      ),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Journal",
          item: "https://kevinellen.com/journal",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Coot field notes",
          item: "https://kevinellen.com/journal/coot-field-notes",
        },
      ],
    });
  });
});
