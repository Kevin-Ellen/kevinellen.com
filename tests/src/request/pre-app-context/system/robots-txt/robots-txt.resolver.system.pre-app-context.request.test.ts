// tests/src/request/pre-context/system/robots-txt/robots-txt.resolver.system.pre-app-context.request.test.ts

import { resolveRobotsTxtSystem } from "@request/pre-app-context/system/robots-txt/robots-txt.resolver.system.pre-app-context.request";

import type { AppState } from "@app-state/class.app-state";

describe("resolveRobotsTxtSystem", () => {
  it("returns null when the request is not /robots.txt", () => {
    const req = new Request("https://dev.kevinellen.com/other");

    const appState = {} as AppState;

    const result = resolveRobotsTxtSystem(req, appState);

    expect(result).toBeNull();
  });

  it("returns robots.txt rules with disallow entries from public pages", () => {
    const req = new Request("https://dev.kevinellen.com/robots.txt");

    const appState = {
      siteConfig: {
        origin: "https://dev.kevinellen.com",
      },
      publicPages: [
        {
          slug: "/",
          robotsTxt: { disallow: false },
        },
        {
          slug: "/private",
          robotsTxt: { disallow: true },
        },
        {
          slug: "/hidden",
          robotsTxt: { disallow: true },
        },
      ],
    } as unknown as AppState;

    const result = resolveRobotsTxtSystem(req, appState);

    expect(result).toEqual({
      sitemapUrl: "https://dev.kevinellen.com/sitemap.xml",
      rules: [
        "User-agent: *",
        "Allow: /",
        "Disallow: /hidden",
        "Disallow: /private",
      ],
    });
  });

  it("deduplicates and sorts disallow rules", () => {
    const req = new Request("https://dev.kevinellen.com/robots.txt");

    const appState = {
      siteConfig: {
        origin: "https://dev.kevinellen.com",
      },
      publicPages: [
        {
          slug: "/zebra",
          robotsTxt: { disallow: true },
        },
        {
          slug: "/alpha",
          robotsTxt: { disallow: true },
        },
        {
          slug: "/zebra",
          robotsTxt: { disallow: true },
        },
      ],
    } as unknown as AppState;

    const result = resolveRobotsTxtSystem(req, appState);

    expect(result).toEqual({
      sitemapUrl: "https://dev.kevinellen.com/sitemap.xml",
      rules: [
        "User-agent: *",
        "Allow: /",
        "Disallow: /alpha",
        "Disallow: /zebra",
      ],
    });
  });
});
