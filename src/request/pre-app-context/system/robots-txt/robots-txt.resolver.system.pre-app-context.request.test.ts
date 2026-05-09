// src/request/pre-app-context/system/robots-txt/robots-txt.resolver.system.pre-app-context.request.test.ts

import { resolveRobotsTxtSystem } from "@request/pre-app-context/system/robots-txt/robots-txt.resolver.system.pre-app-context.request";

const createRequest = (path: string): Request =>
  new Request(`https://example.com${path}`);

const createAppState = (publicPages: unknown[] = []) =>
  ({
    siteConfig: {
      origin: "https://example.com",
    },
    publicPages,
  }) as never;

describe("resolveRobotsTxtSystem", () => {
  it("returns null when request is not for robots.txt", () => {
    const result = resolveRobotsTxtSystem(
      createRequest("/not-robots.txt"),
      createAppState(),
    );

    expect(result).toBeNull();
  });

  it("resolves base robots.txt rules and sitemap URL", () => {
    const result = resolveRobotsTxtSystem(
      createRequest("/robots.txt"),
      createAppState(),
    );

    expect(result).toEqual({
      sitemapUrl: "https://example.com/sitemap.xml",
      rules: ["User-agent: *", "Allow: /"],
    });
  });

  it("adds sorted unique disallow rules from public pages", () => {
    const result = resolveRobotsTxtSystem(
      createRequest("/robots.txt"),
      createAppState([
        {
          id: "private-b",
          slug: "/private-b",
          robotsTxt: { disallow: true },
        },
        {
          id: "public-page",
          slug: "/public",
          robotsTxt: null,
        },
        {
          id: "private-a",
          slug: "/private-a",
          robotsTxt: { disallow: true },
        },
        {
          id: "private-b-duplicate",
          slug: "/private-b",
          robotsTxt: { disallow: true },
        },
        {
          id: "allowed-page",
          slug: "/allowed",
          robotsTxt: { disallow: false },
        },
      ]),
    );

    expect(result).toEqual({
      sitemapUrl: "https://example.com/sitemap.xml",
      rules: [
        "User-agent: *",
        "Allow: /",
        "Disallow: /private-a",
        "Disallow: /private-b",
      ],
    });
  });

  it("throws when a disallowed public page is missing a slug", () => {
    expect(() =>
      resolveRobotsTxtSystem(
        createRequest("/robots.txt"),
        createAppState([
          {
            id: "broken-page",
            slug: null,
            robotsTxt: { disallow: true },
          },
        ]),
      ),
    ).toThrow("Public page 'broken-page' is missing a slug.");
  });
});
