// tests/src/app-state/resolve/webmanifest.resolve.app-state.test.ts

import { appStateResolveWebmanifest } from "@app-state/resolve/webmanifest.resolve.app-state";

describe("appStateResolveWebmanifest", () => {
  const makeSiteConfig = () =>
    ({
      siteName: "Kevin Ellen",
      description:
        "Wildlife photography, field notes, and technical work exploring nature and digital publishing.",
      origin: "https://kevinellen.com",
      headerBranding: {
        homeHref: "/",
      },
    }) as unknown as import("@shared-types/config/site-config/app-state.site-config.types").AppStateSiteConfig;

  it("derives web manifest values from site config", () => {
    const siteConfig = makeSiteConfig();

    const result = appStateResolveWebmanifest(siteConfig);

    expect(result.name).toBe(siteConfig.siteName);
    expect(result.description).toBe(siteConfig.description);
    expect(result.scope).toBe(siteConfig.headerBranding.homeHref);
    expect(result.startUrl).toBe("https://kevinellen.com/");
  });

  it("sets display mode to minimal-ui", () => {
    const result = appStateResolveWebmanifest(makeSiteConfig());

    expect(result.display).toBe("minimal-ui");
  });

  it("provides default icon set", () => {
    const result = appStateResolveWebmanifest(makeSiteConfig());

    expect(result.icons).toEqual([
      {
        src: "/assets/icons/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/assets/icons/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ]);
  });

  it("returns a deeply frozen web manifest", () => {
    const result = appStateResolveWebmanifest(makeSiteConfig());

    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.icons)).toBe(true);
  });
});
