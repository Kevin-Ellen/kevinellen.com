// tests/src/request/pre-context/system/xml-sitemap/xml-sitemap.resolver.system.pre-app-context.request.test.ts

import { resolveXmlSitemapSystem } from "@request/pre-app-context/system/sitemap-xml/xml-sitemap.resolver.system.pre-app-context.request";

import type { AppState } from "@app-state/class.app-state";

describe("resolveXmlSitemapSystem", () => {
  it("returns null when the request is not /sitemap.xml", () => {
    const req = new Request("https://dev.kevinellen.com/other");

    const appState = {} as AppState;

    const result = resolveXmlSitemapSystem(req, appState);

    expect(result).toBeNull();
  });

  it("returns urls for pages included in sitemap", () => {
    const req = new Request("https://dev.kevinellen.com/sitemap.xml");

    const appState = {
      siteConfig: {
        origin: "https://dev.kevinellen.com",
      },
      publicPages: [
        {
          slug: "/",
          sitemapXml: { include: true },
        },
        {
          slug: "/about",
          sitemapXml: { include: true },
        },
        {
          slug: "/secret",
          sitemapXml: { include: false },
        },
      ],
    } as unknown as AppState;

    const result = resolveXmlSitemapSystem(req, appState);

    expect(result).toEqual({
      urls: ["https://dev.kevinellen.com/", "https://dev.kevinellen.com/about"],
    });
  });

  it("returns empty urls array when no pages are included", () => {
    const req = new Request("https://dev.kevinellen.com/sitemap.xml");

    const appState = {
      siteConfig: {
        origin: "https://dev.kevinellen.com",
      },
      publicPages: [
        {
          slug: "/hidden",
          sitemapXml: { include: false },
        },
      ],
    } as unknown as AppState;

    const result = resolveXmlSitemapSystem(req, appState);

    expect(result).toEqual({
      urls: [],
    });
  });

  it("ignores pages where sitemapXml is null", () => {
    const req = new Request("https://dev.kevinellen.com/sitemap.xml");

    const appState = {
      siteConfig: {
        origin: "https://dev.kevinellen.com",
      },
      publicPages: [
        {
          slug: "/draft",
          sitemapXml: null,
        },
        {
          slug: "/about",
          sitemapXml: { include: true },
        },
      ],
    } as unknown as AppState;

    const result = resolveXmlSitemapSystem(req, appState);

    expect(result).toEqual({
      urls: ["https://dev.kevinellen.com/about"],
    });
  });

  it("throws when an included public page is missing a slug", () => {
    const req = new Request("https://dev.kevinellen.com/sitemap.xml");

    const appState = {
      siteConfig: {
        origin: "https://dev.kevinellen.com",
      },
      publicPages: [
        {
          id: "about",
          slug: null,
          sitemapXml: { include: true },
        },
      ],
    } as unknown as AppState;

    expect(() => resolveXmlSitemapSystem(req, appState)).toThrow(
      "Public page 'about' is missing a slug.",
    );
  });
});
