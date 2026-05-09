// src/app-state/resolve/structured-data.resolve.app-state.test.ts

import { appStateResolveStructuredData } from "@app-state/resolve/structured-data.resolve.app-state";

describe("appStateResolveStructuredData", () => {
  it("resolves website structured data from site config", () => {
    expect(
      appStateResolveStructuredData({
        siteName: "Kevin Ellen",
        description: "Nature, technical notes, and field journals.",
        language: "en-GB",
      } as never),
    ).toEqual({
      website: {
        id: {
          pageId: "home",
          hash: "#website",
        },
        url: {
          pageId: "home",
        },
        name: "Kevin Ellen",
        description: "Nature, technical notes, and field journals.",
        inLanguage: "en-GB",
        publisherId: {
          pageId: "about",
          hash: "#person",
        },
      },
    });
  });
});
