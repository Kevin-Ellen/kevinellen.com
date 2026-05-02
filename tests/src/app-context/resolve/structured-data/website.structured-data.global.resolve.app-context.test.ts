// tests/src/app-context/resolve/structured-data/website.structured-data.global.resolve.app-context.test.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppStateWebSiteStructuredData } from "@shared-types/config/structured-data/app-state.website.structured-data.types";

import { resolveWebsiteStructuredDataGlobalAppContext } from "@app-context/resolve/structured-data/website.structured-data.global.resolve.app-context";

const structuredData: AppStateWebSiteStructuredData = {
  id: {
    pageId: "home",
    hash: "#website",
  },
  url: {
    pageId: "home",
  },
  name: "Kevin Ellen",
  description: "Wildlife photography, field notes, and technical work.",
  inLanguage: "en-GB",
  publisherId: {
    pageId: "about",
    hash: "#person",
  },
};

const makeAppState = (): AppState =>
  ({
    siteConfig: {
      origin: "https://dev.kevinellen.com",
    },
    getPublicPageById: jest.fn((id: string) => {
      if (id === "home") {
        return {
          id: "home",
          slug: "/",
        };
      }

      if (id === "about") {
        return {
          id: "about",
          slug: "/about",
        };
      }

      return null;
    }),
  }) as unknown as AppState;

describe("resolveWebsiteStructuredDataGlobalAppContext", () => {
  it("resolves website structured data references to absolute urls", () => {
    const appState = makeAppState();

    const result = resolveWebsiteStructuredDataGlobalAppContext(
      structuredData,
      appState,
    );

    expect(result).toEqual({
      id: "website",
      json: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://dev.kevinellen.com/#website",
        url: "https://dev.kevinellen.com/",
        name: "Kevin Ellen",
        description: "Wildlife photography, field notes, and technical work.",
        inLanguage: "en-GB",
        publisher: {
          "@id": "https://dev.kevinellen.com/about#person",
        },
      },
    });

    expect(appState.getPublicPageById).toHaveBeenCalledWith("home");
    expect(appState.getPublicPageById).toHaveBeenCalledWith("about");
  });

  it("resolves a reference without a hash", () => {
    const appState = makeAppState();

    const result = resolveWebsiteStructuredDataGlobalAppContext(
      {
        ...structuredData,
        id: {
          pageId: "about",
        },
      },
      appState,
    );

    expect(result.json).toEqual(
      expect.objectContaining({
        "@id": "https://dev.kevinellen.com/about",
      }),
    );
  });

  it("throws when the id page reference cannot be resolved", () => {
    const appState = makeAppState();

    expect(() =>
      resolveWebsiteStructuredDataGlobalAppContext(
        {
          ...structuredData,
          id: {
            pageId: "missing-page" as never,
            hash: "#website",
          },
        },
        appState,
      ),
    ).toThrow(
      "Missing public page for structured data reference 'missing-page'.",
    );
  });

  it("throws when the url page reference cannot be resolved", () => {
    const appState = makeAppState();

    expect(() =>
      resolveWebsiteStructuredDataGlobalAppContext(
        {
          ...structuredData,
          url: {
            pageId: "missing-page" as never,
          },
        },
        appState,
      ),
    ).toThrow(
      "Missing public page for structured data reference 'missing-page'.",
    );
  });

  it("throws when the publisher page reference cannot be resolved", () => {
    const appState = makeAppState();

    expect(() =>
      resolveWebsiteStructuredDataGlobalAppContext(
        {
          ...structuredData,
          publisherId: {
            pageId: "missing-page" as never,
            hash: "#person",
          },
        },
        appState,
      ),
    ).toThrow(
      "Missing public page for structured data reference 'missing-page'.",
    );
  });
});
