// src/app/life-cycle/system/sitemap-xml/sitemap-xml.system.test.ts

import type { AppInit } from "../../app-init/class.app-init";
import type { PublishedRegistry } from "../../../../shared/types/content/kv-ledger.content.shared.type";

import { resolveSitemapSystem } from "./sitemap-xml.system";

describe("Sitemap XML system", () => {
  const canonicalDomain = "https://kevinellen.com";

  type BundledPage = AppInit["content"]["bySlug"][string];
  type PublishedEntry = PublishedRegistry["bySlug"][string];

  const createBundledPage = (
    slug: string | null,
    sitemap: boolean,
  ): BundledPage =>
    ({
      slug,
      metadata: { sitemap },
    }) as BundledPage;

  const createPublishedEntry = (
    slug: string,
    sitemap: boolean,
    photos: readonly string[] = [],
  ): PublishedEntry => ({
    id: slug,
    kind: "journal",
    slug,
    dateCreated: "2026-11-04",
    label: "Test journal",
    sitemap,
    breadcrumbs: [],
    title: "Test journal",
    intro: "A journal entry for sitemap regression testing.",
    photos,
    topics: [],
  });

  const resolve = (
    bundled: Record<string, BundledPage> = {},
    published: Record<string, PublishedEntry> = {},
  ) => {
    const appInit = {
      site: { canonicalDomain },
      content: { bySlug: bundled },
    } as AppInit;

    const ledger = {
      bySlug: published,
    } as PublishedRegistry;

    return resolveSitemapSystem({ appInit, ledger });
  };

  describe("Response", () => {
    it("returns an XML response with status 200", () => {
      const response = resolve();

      expect(response.kind).toBe("xml");
      expect(response.status).toBe(200);
    });

    it("renders a valid sitemap document structure", () => {
      const response = resolve();

      expect(response.body).toBe(
        [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
          "</urlset>",
        ].join("\n"),
      );
    });

    it("renders an empty sitemap when no entries exist", () => {
      const response = resolve();

      expect(response.body).not.toContain("<url>");
      expect(response.body).not.toContain("<loc>");
    });
  });

  describe("Bundled pages", () => {
    it("includes pages enabled for sitemap", () => {
      const response = resolve({
        "/about": createBundledPage("/about", true),
      });

      expect(response.body).toContain(
        "<loc>https://kevinellen.com/about</loc>",
      );
    });

    it("excludes pages disabled for sitemap", () => {
      const response = resolve({
        "/private": createBundledPage("/private", false),
      });

      expect(response.body).not.toContain("https://kevinellen.com/private");
    });

    it("excludes pages with null slugs", () => {
      const response = resolve({
        fallback: createBundledPage(null, true),
      });

      expect(response.body).not.toContain("<url>");
    });

    it("includes only eligible bundled pages", () => {
      const response = resolve({
        "/": createBundledPage("/", true),
        "/about": createBundledPage("/about", true),
        "/hidden": createBundledPage("/hidden", false),
        fallback: createBundledPage(null, true),
      });

      expect(response.body.match(/<url>/g)).toHaveLength(2);

      expect(response.body).toContain("<loc>https://kevinellen.com/</loc>");

      expect(response.body).toContain(
        "<loc>https://kevinellen.com/about</loc>",
      );

      expect(response.body).not.toContain("/hidden");
    });
  });

  describe("Published content", () => {
    it("includes published entries enabled for sitemap", () => {
      const response = resolve(
        {},
        {
          journal: createPublishedEntry("/journals/epping-forest", true),
        },
      );

      expect(response.body).toContain(
        "<loc>https://kevinellen.com/journals/epping-forest</loc>",
      );
    });

    it("excludes published entries disabled for sitemap", () => {
      const response = resolve(
        {},
        {
          hidden: createPublishedEntry("/journals/hidden", false),
        },
      );

      expect(response.body).not.toContain("/journals/hidden");
    });

    it("renders published entries without photographs", () => {
      const response = resolve(
        {},
        {
          journal: createPublishedEntry("/journals/example", true),
        },
      );

      expect(response.body).toContain(
        "<loc>https://kevinellen.com/journals/example</loc>",
      );

      expect(response.body).not.toContain("<image:image>");
    });
  });

  describe("Photography", () => {
    it("renders image sitemap entries", () => {
      const response = resolve(
        {},
        {
          journal: createPublishedEntry("/journals/epping-forest", true, [
            "fox-in-woodland",
          ]),
        },
      );

      expect(response.body).toContain(
        [
          "<image:image>",
          "<image:loc>https://kevinellen.com/media/photo/fox-in-woodland</image:loc>",
          "</image:image>",
        ].join("\n"),
      );
    });

    it("renders multiple photographs in order", () => {
      const response = resolve(
        {},
        {
          journal: createPublishedEntry("/journals/example", true, [
            "photo-one",
            "photo-two",
            "photo-three",
          ]),
        },
      );

      expect(response.body.match(/<image:image>/g)).toHaveLength(3);

      const first = response.body.indexOf("photo-one");
      const second = response.body.indexOf("photo-two");
      const third = response.body.indexOf("photo-three");

      expect(first).toBeGreaterThan(-1);
      expect(first).toBeLessThan(second);
      expect(second).toBeLessThan(third);
    });

    it("URL-encodes photograph identifiers", () => {
      const response = resolve(
        {},
        {
          journal: createPublishedEntry("/journals/example", true, [
            "photo with spaces",
          ]),
        },
      );

      expect(response.body).toContain("/media/photo/photo%20with%20spaces");
    });

    it("does not include photographs from excluded entries", () => {
      const response = resolve(
        {},
        {
          hidden: createPublishedEntry("/journals/hidden", false, [
            "hidden-photo",
          ]),
        },
      );

      expect(response.body).not.toContain("hidden-photo");
      expect(response.body).not.toContain("<image:image>");
    });
  });

  describe("XML escaping", () => {
    it("escapes ampersands in canonical URLs", () => {
      const response = resolve({
        "/search?q=birds&location=essex": createBundledPage(
          "/search?q=birds&location=essex",
          true,
        ),
      });

      expect(response.body).toContain(
        "<loc>https://kevinellen.com/search?q=birds&amp;location=essex</loc>",
      );
    });

    it("escapes special characters in image URLs", () => {
      const response = resolve(
        {},
        {
          journal: createPublishedEntry("/journals/example", true, [
            "photo&example",
          ]),
        },
      );

      expect(response.body).toContain("/media/photo/photo%26example");

      expect(response.body).not.toContain("/media/photo/photo&example");
    });
  });

  describe("Ordering", () => {
    it("renders bundled pages before published entries", () => {
      const response = resolve(
        {
          "/about": createBundledPage("/about", true),
        },
        {
          journal: createPublishedEntry("/journals/example", true),
        },
      );

      const bundledIndex = response.body.indexOf(
        "https://kevinellen.com/about",
      );

      const publishedIndex = response.body.indexOf(
        "https://kevinellen.com/journals/example",
      );

      expect(bundledIndex).toBeGreaterThan(-1);
      expect(publishedIndex).toBeGreaterThan(bundledIndex);
    });

    it("preserves published registry iteration order", () => {
      const response = resolve(
        {},
        {
          first: createPublishedEntry("/journals/first", true),
          second: createPublishedEntry("/journals/second", true),
        },
      );

      expect(response.body.indexOf("/journals/first")).toBeLessThan(
        response.body.indexOf("/journals/second"),
      );
    });
  });
});
