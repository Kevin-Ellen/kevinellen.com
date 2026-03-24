// tests/src/app/system/xml-sitemap/build.xml-sitemap.test.ts

import type { AppState } from "@app/appState/appState";

import { buildXmlSitemap } from "@app/system/xml-sitemap/build.xml-sitemap";

describe("buildXmlSitemap", () => {
  const createAppState = (siteUrl = "https://kevinellen.com"): AppState => {
    return {
      getSiteConfig: jest.fn(() => ({
        siteUrl,
      })),
    } as unknown as AppState;
  };

  it("creates a sitemap document containing the site root URL", () => {
    const appState = createAppState();

    const result = buildXmlSitemap(appState);

    expect(result).toEqual({
      urls: [
        {
          loc: "https://kevinellen.com",
        },
      ],
    });
  });

  it("derives the root URL from site.siteUrl", () => {
    const appState = createAppState("https://example.com");

    const result = buildXmlSitemap(appState);

    expect(result).toEqual({
      urls: [
        {
          loc: "https://example.com",
        },
      ],
    });
  });

  it("reads site config once when building the sitemap", () => {
    const appState = createAppState();

    buildXmlSitemap(appState);

    expect(appState.getSiteConfig).toHaveBeenCalledTimes(1);
  });

  it("preserves the configured site URL without rewriting it", () => {
    const appState = createAppState("https://www.example.com");

    const result = buildXmlSitemap(appState);

    expect(result).toEqual({
      urls: [
        {
          loc: "https://www.example.com",
        },
      ],
    });
  });
});
