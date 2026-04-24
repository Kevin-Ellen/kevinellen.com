// tests/src/app-render-context/resolve/doc-close/breadcrumbs.structured-data.resolve.app-render-context.test.ts

import { resolveBreadcrumbsStructuredDataAppRenderContext } from "@app-render-context/resolve/doc-close/breadcrumbs.structured-data.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

describe("resolveBreadcrumbsStructuredDataAppRenderContext", () => {
  const origin = "https://dev.kevinellen.com";

  it("returns null when there are no breadcrumb items", () => {
    const appContext = {
      breadcrumbs: {
        items: [],
        current: "Home",
      },
      canonicalUrl: "https://dev.kevinellen.com/",
    } as unknown as AppContext;

    const result = resolveBreadcrumbsStructuredDataAppRenderContext(
      appContext,
      origin,
    );

    expect(result).toBeNull();
  });

  it("returns null when canonicalUrl is null", () => {
    const appContext = {
      breadcrumbs: {
        items: [
          {
            text: "Home",
            href: "/",
          },
        ],
        current: "About",
      },
      canonicalUrl: null,
    } as unknown as AppContext;

    const result = resolveBreadcrumbsStructuredDataAppRenderContext(
      appContext,
      origin,
    );

    expect(result).toBeNull();
  });

  it("resolves breadcrumb structured data with absolute item URLs", () => {
    const appContext = {
      breadcrumbs: {
        items: [
          {
            text: "Home",
            href: "/",
          },
        ],
        current: "About",
      },
      canonicalUrl: "https://dev.kevinellen.com/about",
    } as unknown as AppContext;

    const result = resolveBreadcrumbsStructuredDataAppRenderContext(
      appContext,
      origin,
    );

    expect(result).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://dev.kevinellen.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About",
          item: "https://dev.kevinellen.com/about",
        },
      ],
    });
  });
});
