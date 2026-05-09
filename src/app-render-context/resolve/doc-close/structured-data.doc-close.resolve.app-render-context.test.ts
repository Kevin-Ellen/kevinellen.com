// src/app-render-context/resolve/doc-close/structured-data.doc-close.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";

import { appRenderContextResolveDocCloseStructuredData } from "@app-render-context/resolve/doc-close/structured-data.doc-close.resolve.app-render-context";
import { appRenderContextResolveDocCloseBreadcrumbsStructuredData } from "@app-render-context/resolve/doc-close/breadcrumbs.doc-close.resolve.app-render-context";

jest.mock(
  "@app-render-context/resolve/doc-close/breadcrumbs.doc-close.resolve.app-render-context",
  () => ({
    appRenderContextResolveDocCloseBreadcrumbsStructuredData: jest.fn(),
  }),
);

describe("appRenderContextResolveDocCloseStructuredData", () => {
  const mockedBreadcrumbs = jest.mocked(
    appRenderContextResolveDocCloseBreadcrumbsStructuredData,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves existing structured data and breadcrumbs", () => {
    const existingEntry = {
      "@context": "https://schema.org",
      "@type": "WebPage",
    };

    const breadcrumbEntry = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
    };

    mockedBreadcrumbs.mockReturnValue(breadcrumbEntry as never);

    const appContext = {
      structuredData: [{ json: existingEntry }],
    } as unknown as AppContext;

    expect(
      appRenderContextResolveDocCloseStructuredData(appContext, {
        origin: "https://kevinellen.com",
      }),
    ).toEqual([existingEntry, breadcrumbEntry]);

    expect(mockedBreadcrumbs).toHaveBeenCalledWith(
      appContext,
      "https://kevinellen.com",
    );
  });

  it("omits breadcrumbs when none are resolved", () => {
    mockedBreadcrumbs.mockReturnValue(null);

    const appContext = {
      structuredData: [
        {
          json: {
            "@context": "https://schema.org",
            "@type": "WebSite",
          },
        },
      ],
    } as unknown as AppContext;

    expect(
      appRenderContextResolveDocCloseStructuredData(appContext, {
        origin: "https://kevinellen.com",
      }),
    ).toEqual([
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
      },
    ]);
  });
});
