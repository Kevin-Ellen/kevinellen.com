// src/app-context/resolve/structured-data/website.structured-data.global.resolve.app-context.test.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppStateWebSiteStructuredData } from "@shared-types/config/structured-data/app-state.website.structured-data.types";

import { appContextResolveWebsiteStructuredData } from "@app-context/resolve/structured-data/website.structured-data.global.resolve.app-context";

describe("appContextResolveWebsiteStructuredData", () => {
  it("resolves website structured data references", () => {
    const structuredData: AppStateWebSiteStructuredData = {
      id: { pageId: "home", hash: "#website" },
      url: { pageId: "home" },
      publisherId: { pageId: "about", hash: "#publisher" },
      name: "Photography Duck",
      description: "Wildlife and field notes.",
      inLanguage: "en-GB",
    };

    const appState = {
      siteConfig: {
        origin: "https://example.com",
      },
      getPublicPageById: jest.fn((pageId: string) => {
        if (pageId === "home") return { slug: "/" };
        if (pageId === "about") return { slug: "/about" };

        return null;
      }),
    } as unknown as AppState;

    expect(
      appContextResolveWebsiteStructuredData(structuredData, appState),
    ).toEqual({
      id: "website",
      json: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://example.com/#website",
        url: "https://example.com/",
        name: "Photography Duck",
        description: "Wildlife and field notes.",
        inLanguage: "en-GB",
        publisher: {
          "@id": "https://example.com/about#publisher",
        },
      },
    });

    expect(appState.getPublicPageById).toHaveBeenCalledTimes(3);
  });

  it("throws when a referenced page is missing", () => {
    const structuredData: AppStateWebSiteStructuredData = {
      id: { pageId: "missing", hash: "#website" },
      url: { pageId: "home" },
      publisherId: { pageId: "about", hash: "#publisher" },
      name: "Photography Duck",
      description: "Wildlife and field notes.",
      inLanguage: "en-GB",
    };

    const appState = {
      siteConfig: {
        origin: "https://example.com",
      },
      getPublicPageById: jest.fn(() => null),
    } as unknown as AppState;

    expect(() =>
      appContextResolveWebsiteStructuredData(structuredData, appState),
    ).toThrow("Missing public page for structured data reference 'missing'.");
  });
});
