// src/app-state/resolve/webmanifest.resolve.app-state.test.ts

import { appStateResolveWebmanifest } from "@app-state/resolve/webmanifest.resolve.app-state";
import { appStateWebManifestAuthored } from "@app-state/config/webmanifest/authored.webmanifest.app-state";

describe("appStateResolveWebmanifest", () => {
  it("resolves webmanifest from site config", () => {
    expect(
      appStateResolveWebmanifest({
        origin: "https://example.com",
        siteName: "Kevin Ellen",
        description: "Nature and technical notes.",
        headerBranding: {
          homeHref: "/",
        },
      } as never),
    ).toEqual({
      ...appStateWebManifestAuthored,
      name: "Kevin Ellen",
      scope: "/",
      description: "Nature and technical notes.",
      startUrl: "https://example.com/",
      display: "minimal-ui",
      icons: [
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
      ],
    });
  });
});
