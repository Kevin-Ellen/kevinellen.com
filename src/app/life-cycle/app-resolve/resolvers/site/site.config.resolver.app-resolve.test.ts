// src/app/life-cycle/app-resolve/resolvers/site/site.config.resolver.app-resolve.test.ts

import { siteConfigAuthored } from "../../../../../shared/config/site.config.shared.authored";
import { resolveSiteConfigAppResolve } from "./site.config.resolver.app-resolve";

type Site = Parameters<typeof resolveSiteConfigAppResolve>[0]["appInit"];

describe("Site config AppResolve resolver", () => {
  const createSite = (overrides: Partial<Site> = {}): Site => ({
    ...siteConfigAuthored,
    canonicalDomain: "https://kevinellen.com",
    ...overrides,
  });

  const resolve = (appInit: Site) => resolveSiteConfigAppResolve({ appInit });

  it("resolves the manifest against the canonical domain", () => {
    const result = resolve(createSite({ manifest: "/site.webmanifest" }));

    expect(result.manifest).toBe("https://kevinellen.com/site.webmanifest");
  });

  it("uses the configured canonical domain", () => {
    const result = resolve(
      createSite({
        canonicalDomain: "https://staging.kevinellen.com",
        manifest: "/site.webmanifest",
      }),
    );

    expect(result.manifest).toBe(
      "https://staging.kevinellen.com/site.webmanifest",
    );
  });

  it("preserves absolute manifest URLs", () => {
    const result = resolve(
      createSite({
        manifest: "https://cdn.example.com/site.webmanifest",
      }),
    );

    expect(result.manifest).toBe("https://cdn.example.com/site.webmanifest");
  });

  it("removes presentation-only site properties", () => {
    const result = resolve(
      createSite({
        titleSuffix: " | Photography",
        description: "Nature photography",
        name: "Test Photographer",
      }),
    );

    expect(result).not.toHaveProperty("titleSuffix");
    expect(result).not.toHaveProperty("description");
    expect(result).not.toHaveProperty("name");
  });

  it("preserves canonicalDomain", () => {
    const result = resolve(createSite());

    expect(result.canonicalDomain).toBe("https://kevinellen.com");
  });

  it("does not mutate the AppInit configuration", () => {
    const appInit = Object.freeze(
      createSite({ manifest: "/site.webmanifest" }),
    );

    const result = resolve(appInit);

    expect(appInit.manifest).toBe("/site.webmanifest");
    expect(result.manifest).toBe("https://kevinellen.com/site.webmanifest");
    expect(result).not.toBe(appInit);
  });

  it("propagates invalid URL errors", () => {
    expect(() =>
      resolve(
        createSite({
          canonicalDomain: "invalid-domain",
          manifest: "/site.webmanifest",
        }),
      ),
    ).toThrow("Invalid URL");
  });
});
