// tests/src/app-state/resolve/structured-data.resolve.app-state.test.ts

import { appStateResolveStructuredData } from "@app-state/resolve/structured-data.resolve.app-state";

describe("appStateResolveStructuredData", () => {
  it("builds website structured data from site config", () => {
    const siteConfig = {
      siteName: "Kevin Ellen",
      description:
        "Wildlife photography, field notes, and technical work exploring nature and digital publishing.",
      language: "en-GB",
    } as never;

    const result = appStateResolveStructuredData(siteConfig);

    expect(result).toEqual({
      website: {
        id: {
          pageId: "home",
          hash: "#website",
        },
        url: {
          pageId: "home",
        },
        name: "Kevin Ellen",
        description:
          "Wildlife photography, field notes, and technical work exploring nature and digital publishing.",
        inLanguage: "en-GB",
        publisherId: {
          pageId: "about",
          hash: "#person",
        },
      },
    });
  });

  it("returns deeply frozen structured data", () => {
    const siteConfig = {
      siteName: "Kevin Ellen",
      description: "Description",
      language: "en-GB",
    } as never;

    const result = appStateResolveStructuredData(siteConfig);

    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.website)).toBe(true);
    expect(Object.isFrozen(result.website.id)).toBe(true);
    expect(Object.isFrozen(result.website.url)).toBe(true);
    expect(Object.isFrozen(result.website.publisherId)).toBe(true);
  });
});
