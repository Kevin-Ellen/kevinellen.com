// src/request/pre-app-context/system/sitemap-xml/xml-sitemap.resolver.system.pre-app-context.request.test.ts

import { resolveXmlSitemapSystem } from "@request/pre-app-context/system/sitemap-xml/xml-sitemap.resolver.system.pre-app-context.request";

const createRequest = (path: string): Request =>
  new Request(`https://example.com${path}`);

const createAppState = (publicPages: unknown[] = []) =>
  ({
    siteConfig: {
      origin: "https://example.com",
    },
    publicPages,
  }) as never;

describe("resolveXmlSitemapSystem", () => {
  it("returns null when request is not for sitemap.xml", () => {
    const result = resolveXmlSitemapSystem(
      createRequest("/journal"),
      createAppState(),
    );

    expect(result).toBeNull();
  });

  it("resolves included public page URLs", () => {
    const result = resolveXmlSitemapSystem(
      createRequest("/sitemap.xml"),
      createAppState([
        {
          id: "home",
          slug: "/",
          sitemapXml: { include: true },
        },
        {
          id: "journal",
          slug: "/journal",
          sitemapXml: { include: true },
        },
        {
          id: "hidden",
          slug: "/hidden",
          sitemapXml: { include: false },
        },
        {
          id: "not-configured",
          slug: "/not-configured",
          sitemapXml: null,
        },
      ]),
    );

    expect(result).toEqual({
      urls: ["https://example.com/", "https://example.com/journal"],
    });
  });

  it("throws when an included public page is missing a slug", () => {
    expect(() =>
      resolveXmlSitemapSystem(
        createRequest("/sitemap.xml"),
        createAppState([
          {
            id: "broken-page",
            slug: null,
            sitemapXml: { include: true },
          },
        ]),
      ),
    ).toThrow("Public page 'broken-page' is missing a slug.");
  });
});
