// src/app-render-context/resolve/doc-open/doc-open.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";

import { appRenderContextResolveDocOpen } from "@app-render-context/resolve/doc-open/doc-open.resolve.app-render-context";
import { appRenderContextResolveDocOpenHeadLinks } from "@app-render-context/resolve/doc-open/head-links.doc-open.resolve.app-render-context";
import { appRenderContextResolveDocOpenPreload } from "@app-render-context/resolve/doc-open/preload.doc-open.resolve.app-render-context";
import { appRenderContextResolveScripts } from "@app-render-context/resolve/shared/scripts.resolve.app-render-context";

jest.mock(
  "@app-render-context/resolve/shared/scripts.resolve.app-render-context",
  () => ({
    appRenderContextResolveScripts: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/doc-open/head-links.doc-open.resolve.app-render-context",
  () => ({
    appRenderContextResolveDocOpenHeadLinks: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/doc-open/preload.doc-open.resolve.app-render-context",
  () => ({
    appRenderContextResolveDocOpenPreload: jest.fn(),
  }),
);

describe("appRenderContextResolveDocOpen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves doc open render context", () => {
    const appContext = {
      metadata: {
        pageTitle: "Kevin Ellen",
        metaDescription: "Wildlife photography and technical notes.",
      },
      socialPreview: {
        openGraphType: "website",
        siteName: "Kevin Ellen",
        title: "Kevin Ellen",
        description: "Wildlife photography and technical notes.",
        url: "https://kevinellen.com/",
        image: null,
        imageWidth: null,
        imageHeight: null,
      },
      language: "en-GB",
      canonicalUrl: "https://kevinellen.com/",
      themeColour: "#ffffff",
    } as unknown as AppContext;

    const inlineScripts = [
      {
        content: "console.log(1);",
        nonce: "nonce-one",
      },
    ];

    const linkScripts = [
      {
        src: "/header.js",
        loading: "defer",
        nonce: "nonce-one",
      },
    ];

    const links = [{ rel: "icon", href: "/favicon.ico" }];
    const preload = [{ rel: "preload", href: "/fonts/site.woff2", as: "font" }];

    jest.mocked(appRenderContextResolveScripts).mockReturnValue({
      inlineScripts,
      linkScripts,
    } as never);

    jest
      .mocked(appRenderContextResolveDocOpenHeadLinks)
      .mockReturnValue(links as never);

    jest
      .mocked(appRenderContextResolveDocOpenPreload)
      .mockReturnValue(preload as never);

    expect(
      appRenderContextResolveDocOpen(appContext, {
        nonce: "nonce-one",
      }),
    ).toEqual({
      metadata: {
        pageTitle: "Kevin Ellen",
        metaDescription: "Wildlife photography and technical notes.",
      },
      socialPreview: {
        openGraphType: "website",
        siteName: "Kevin Ellen",
        title: "Kevin Ellen",
        description: "Wildlife photography and technical notes.",
        url: "https://kevinellen.com/",
        image: null,
        imageWidth: null,
        imageHeight: null,
        twitterCard: "summary_large_image",
      },
      language: "en-GB",
      canonicalUrl: "https://kevinellen.com/",
      inlineScripts,
      linkScripts,
      links,
      preload,
      nonce: "nonce-one",
      themeColour: "#ffffff",
    });

    expect(appRenderContextResolveScripts).toHaveBeenCalledWith(appContext, {
      location: "header",
      nonce: "nonce-one",
    });

    expect(appRenderContextResolveDocOpenHeadLinks).toHaveBeenCalledWith(
      appContext,
    );

    expect(appRenderContextResolveDocOpenPreload).toHaveBeenCalledWith(
      appContext,
    );
  });
});
