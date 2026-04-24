// tests/src/app-render-context/resolve/doc-open/head-links.resolve.app-render-context.test.ts

import { resolveHeadLinksAppRenderContext } from "@app-render-context/resolve/doc-open/head-links.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

describe("resolveHeadLinksAppRenderContext", () => {
  it("resolves document head link assets", () => {
    const appContext = {
      headAssets: {
        faviconIco: {
          href: "/favicon.ico",
        },
        faviconSvg: {
          href: "/assets/icons/ke-monogram-logo.svg",
          type: "image/svg+xml",
        },
        faviconPng: {
          href: "/assets/icons/favicon-96x96.png",
          sizes: "96x96",
          type: "image/png",
        },
        appleTouchIcon: {
          href: "/apple-touch-icon.png",
        },
        manifest: {
          href: "/manifest.webmanifest",
        },
      },
    } as unknown as AppContext;

    const result = resolveHeadLinksAppRenderContext(appContext);

    expect(result).toEqual([
      {
        rel: "icon",
        href: "/favicon.ico",
      },
      {
        rel: "icon",
        href: "/assets/icons/ke-monogram-logo.svg",
        type: "image/svg+xml",
      },
      {
        rel: "icon",
        href: "/assets/icons/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "manifest",
        href: "/manifest.webmanifest",
      },
    ]);
  });
});
