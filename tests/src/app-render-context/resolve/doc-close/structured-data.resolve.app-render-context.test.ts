// tests/src/app-render-context/resolve/doc-close/structured-data.resolve.app-render-context.test.ts

import { resolveStructuredDataAppRenderContext } from "@app-render-context/resolve/doc-close/structured-data.resolve.app-render-context";
import { resolveBreadcrumbsStructuredDataAppRenderContext } from "@app-render-context/resolve/doc-close/breadcrumbs.structured-data.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

jest.mock(
  "@app-render-context/resolve/doc-close/breadcrumbs.structured-data.resolve.app-render-context",
  () => ({
    resolveBreadcrumbsStructuredDataAppRenderContext: jest.fn(),
  }),
);

describe("resolveStructuredDataAppRenderContext", () => {
  const context = {
    origin: "https://dev.kevinellen.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("maps AppContext structured data entries and appends breadcrumb structured data", () => {
    const websiteJson = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Kevin Ellen",
    } as const;

    const personJson = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Kevin Ellen",
    } as const;

    const breadcrumbJson = {
      "@context": "https://schema.org" as const,
      "@type": "BreadcrumbList" as const,
      itemListElement: [
        {
          "@type": "ListItem" as const,
          position: 1,
          name: "Home",
          item: "https://dev.kevinellen.com/",
        },
      ],
    };

    const appContext = {
      structuredData: [
        {
          id: "website",
          json: websiteJson,
        },
        {
          id: "person",
          json: personJson,
        },
      ],
    } as unknown as AppContext;

    jest
      .mocked(resolveBreadcrumbsStructuredDataAppRenderContext)
      .mockReturnValue(breadcrumbJson);

    const result = resolveStructuredDataAppRenderContext(appContext, context);

    expect(
      resolveBreadcrumbsStructuredDataAppRenderContext,
    ).toHaveBeenCalledWith(appContext, context.origin);

    expect(result).toEqual([websiteJson, personJson, breadcrumbJson]);
  });

  it("returns only mapped structured data when breadcrumb structured data is null", () => {
    const websiteJson = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Kevin Ellen",
    } as const;

    const appContext = {
      structuredData: [
        {
          id: "website",
          json: websiteJson,
        },
      ],
    } as unknown as AppContext;

    jest
      .mocked(resolveBreadcrumbsStructuredDataAppRenderContext)
      .mockReturnValue(null);

    const result = resolveStructuredDataAppRenderContext(appContext, context);

    expect(result).toEqual([websiteJson]);
  });

  it("returns an empty array when no structured data entries exist and breadcrumbs are null", () => {
    const appContext = {
      structuredData: [],
    } as unknown as AppContext;

    jest
      .mocked(resolveBreadcrumbsStructuredDataAppRenderContext)
      .mockReturnValue(null);

    const result = resolveStructuredDataAppRenderContext(appContext, context);

    expect(result).toEqual([]);
  });
});
