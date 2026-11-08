// src/app/life-cycle/app-init/resolvers/robots-txt/robots-txt.resolver.app-init.test.ts

import { resolveRobotsTxtConfigAppInit } from "./robots-txt.resolver.app-init";

type Input = Parameters<typeof resolveRobotsTxtConfigAppInit>[0];
type Authored = Input["authored"];
type Group = Authored["groups"][number];

describe("Robots.txt config AppInit resolver", () => {
  const canonicalDomain = "https://kevinellen.com";

  const createGroup = (overrides: Partial<Group> = {}): Group => ({
    userAgents: ["*"],
    ...overrides,
  });

  const createAuthored = (overrides: Partial<Authored> = {}): Authored => ({
    groups: [],
    sitemapPath: "/sitemap.xml",
    ...overrides,
  });

  const resolve = (authored: Authored, domain = canonicalDomain) =>
    resolveRobotsTxtConfigAppInit({
      authored,
      canonicalDomain: domain,
    });

  describe("Group resolution", () => {
    it("supports an empty group collection", () => {
      const result = resolve(createAuthored());

      expect(result.groups).toEqual([]);
    });

    it("normalises omitted directives", () => {
      const result = resolve(
        createAuthored({
          groups: [createGroup()],
        }),
      );

      expect(result.groups).toEqual([
        {
          userAgents: ["*"],
          allow: [],
          disallow: [],
          crawlDelay: null,
        },
      ]);
    });

    it("normalises explicitly undefined directives", () => {
      const result = resolve(
        createAuthored({
          groups: [
            createGroup({
              allow: undefined,
              disallow: undefined,
              crawlDelay: undefined,
            }),
          ],
        }),
      );

      expect(result.groups[0]).toMatchObject({
        allow: [],
        disallow: [],
        crawlDelay: null,
      });
    });

    it("preserves explicit allow and disallow directives", () => {
      const allow = ["/", "/journals/"];
      const disallow = ["/private/", "/internal/"];

      const result = resolve(
        createAuthored({
          groups: [
            createGroup({
              allow,
              disallow,
            }),
          ],
        }),
      );

      expect(result.groups[0]?.allow).toBe(allow);
      expect(result.groups[0]?.disallow).toBe(disallow);
    });

    it("preserves an explicit crawl delay", () => {
      const result = resolve(
        createAuthored({
          groups: [
            createGroup({
              crawlDelay: 10,
            }),
          ],
        }),
      );

      expect(result.groups[0]?.crawlDelay).toBe(10);
    });

    it("preserves a zero crawl delay", () => {
      const result = resolve(
        createAuthored({
          groups: [
            createGroup({
              crawlDelay: 0,
            }),
          ],
        }),
      );

      expect(result.groups[0]?.crawlDelay).toBe(0);
    });

    it("preserves multiple user agents", () => {
      const userAgents = ["Googlebot", "Bingbot"];

      const result = resolve(
        createAuthored({
          groups: [createGroup({ userAgents })],
        }),
      );

      expect(result.groups[0]?.userAgents).toBe(userAgents);
    });

    it("resolves multiple groups in authored order", () => {
      const result = resolve(
        createAuthored({
          groups: [
            createGroup({
              userAgents: ["*"],
              disallow: ["/private/"],
            }),
            createGroup({
              userAgents: ["Googlebot"],
              allow: ["/"],
            }),
          ],
        }),
      );

      expect(result.groups).toHaveLength(2);

      expect(result.groups[0]).toMatchObject({
        userAgents: ["*"],
        disallow: ["/private/"],
      });

      expect(result.groups[1]).toMatchObject({
        userAgents: ["Googlebot"],
        allow: ["/"],
      });
    });
  });

  describe("Sitemap URL resolution", () => {
    it("resolves a root-relative sitemap path", () => {
      const result = resolve(createAuthored());

      expect(result.sitemapUrl).toBe("https://kevinellen.com/sitemap.xml");
    });

    it("resolves a sitemap path against a different domain", () => {
      const result = resolve(
        createAuthored(),
        "https://staging.kevinellen.com",
      );

      expect(result.sitemapUrl).toBe(
        "https://staging.kevinellen.com/sitemap.xml",
      );
    });

    it("supports nested sitemap paths", () => {
      const result = resolve(
        createAuthored({
          sitemapPath: "/sitemaps/index.xml",
        }),
      );

      expect(result.sitemapUrl).toBe(
        "https://kevinellen.com/sitemaps/index.xml",
      );
    });

    it("supports absolute sitemap URLs", () => {
      const result = resolve(
        createAuthored({
          sitemapPath: "https://cdn.example.com/sitemap.xml",
        }),
      );

      expect(result.sitemapUrl).toBe("https://cdn.example.com/sitemap.xml");
    });

    it("resolves a relative path against the domain pathname", () => {
      const result = resolve(
        createAuthored({
          sitemapPath: "sitemap.xml",
        }),
        "https://example.com/subdirectory/",
      );

      expect(result.sitemapUrl).toBe(
        "https://example.com/subdirectory/sitemap.xml",
      );
    });

    it("propagates URL construction errors", () => {
      expect(() => resolve(createAuthored(), "not-a-valid-base-url")).toThrow(
        "Invalid URL",
      );
    });
  });

  describe("Data integrity", () => {
    it("does not mutate authored groups", () => {
      const group = createGroup({
        allow: ["/"],
      });

      const authored = createAuthored({
        groups: [group],
      });

      const result = resolve(authored);

      expect(authored.groups[0]).toBe(group);
      expect(group.allow).toEqual(["/"]);
      expect(result.groups).not.toBe(authored.groups);
      expect(result.groups[0]).not.toBe(group);
    });

    it("supports frozen authored configuration", () => {
      const group = Object.freeze(createGroup());

      const authored = Object.freeze(
        createAuthored({
          groups: Object.freeze([group]),
        }),
      );

      const result = resolve(authored);

      expect(result.groups[0]?.userAgents).toEqual(["*"]);
      expect(result.groups[0]?.crawlDelay).toBeNull();
    });
  });
});
