// src/app-render-context/resolve/doc-open/head-links.doc-open.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";

import { appRenderContextResolveDocOpenHeadLinks } from "@app-render-context/resolve/doc-open/head-links.doc-open.resolve.app-render-context";

describe("appRenderContextResolveDocOpenHeadLinks", () => {
  it("resolves configured head link assets", () => {
    const appContext = {
      headAssets: {
        faviconIco: {
          href: "/favicon.ico",
        },
        faviconSvg: {
          href: "/favicon.svg",
          type: "image/svg+xml",
        },
        faviconPng: {
          href: "/favicon.png",
          sizes: "96x96",
          type: "image/png",
        },
        appleTouchIcon: {
          href: "/apple-touch-icon.png",
        },
        manifest: {
          href: "/site.webmanifest",
        },
      },
    } as unknown as AppContext;

    expect(appRenderContextResolveDocOpenHeadLinks(appContext)).toEqual([
      {
        rel: "icon",
        href: "/favicon.ico",
      },
      {
        rel: "icon",
        href: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        rel: "icon",
        href: "/favicon.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "manifest",
        href: "/site.webmanifest",
      },
    ]);
  });
});
