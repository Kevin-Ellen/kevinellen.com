// tests/src/app-render-context/resolve/doc-close/structured-data.resolve.app-render-context.test.ts

import { resolveStructuredDataAppRenderContext } from "@app-render-context/resolve/doc-close/structured-data.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

describe("resolveStructuredDataAppRenderContext", () => {
  it("maps AppContext structured data entries to render JSON nodes", () => {
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

    const result = resolveStructuredDataAppRenderContext(appContext);

    expect(result).toEqual([websiteJson, personJson]);
  });

  it("returns an empty array when no structured data entries exist", () => {
    const appContext = {
      structuredData: [],
    } as unknown as AppContext;

    const result = resolveStructuredDataAppRenderContext(appContext);

    expect(result).toEqual([]);
  });
});
