// tests/src/app/system/robots/build.robots.test.ts

import type { AppState } from "@app/appState/appState";

import { buildRobotsDocument } from "@app/system/robots/build.robots";

describe("buildRobotsDocument", () => {
  const createAppState = (siteUrl = "https://kevinellen.com"): AppState => {
    return {
      getSiteConfig: jest.fn(() => ({
        siteUrl,
      })),
    } as unknown as AppState;
  };

  it("creates the default wildcard robots document", () => {
    const appState = createAppState();

    const result = buildRobotsDocument(appState);

    expect(result).toEqual({
      rules: [
        {
          userAgent: "*",
          disallow: [],
        },
      ],
      sitemaps: ["https://kevinellen.com/sitemap.xml"],
    });
  });

  it("derives the sitemap URL from site.siteUrl", () => {
    const appState = createAppState("https://example.com");

    const result = buildRobotsDocument(appState);

    expect(result.sitemaps).toEqual(["https://example.com/sitemap.xml"]);
  });

  it("preserves the configured site origin when deriving the sitemap URL", () => {
    const appState = createAppState("https://www.example.com");

    const result = buildRobotsDocument(appState);

    expect(result.sitemaps).toEqual(["https://www.example.com/sitemap.xml"]);
  });

  it("reads site config once when building the document", () => {
    const appState = createAppState();

    buildRobotsDocument(appState);

    expect(appState.getSiteConfig).toHaveBeenCalledTimes(1);
  });
});
