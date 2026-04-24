// tests/src/app-render-context/resolve/doc-open/doc-open.resolve.app-render-context.test.ts

import { resolveDocOpenAppRenderContext } from "@app-render-context/resolve/doc-open/doc-open.resolve.app-render-context";
import { resolveScriptsAppRenderContext } from "@app-render-context/resolve/shared/scripts.assets.resolve.app-render-context";
import { resolveHeadLinksAppRenderContext } from "@app-render-context/resolve/doc-open/head-links.resolve.app-render-context";
import { resolvePreloadAppRenderContext } from "@app-render-context/resolve/doc-open/preload.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

jest.mock(
  "@app-render-context/resolve/shared/scripts.assets.resolve.app-render-context",
  () => ({
    resolveScriptsAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/doc-open/head-links.resolve.app-render-context",
  () => ({
    resolveHeadLinksAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/doc-open/preload.resolve.app-render-context",
  () => ({
    resolvePreloadAppRenderContext: jest.fn(),
  }),
);

describe("resolveDocOpenAppRenderContext", () => {
  it("resolves document opening data", () => {
    const appContext = {
      metadata: {
        pageTitle: "About | Kevin Ellen",
        metaDescription: "About Kevin Ellen.",
      },
      language: "en-GB",
      canonicalUrl: "https://dev.kevinellen.com/about",
      themeColour: "#1f2621",
    } as unknown as AppContext;

    const nonce = "test-nonce";

    const scripts = {
      inlineScripts: [
        { id: "header-inline", content: "console.log('x')", nonce },
      ],
      linkScripts: [{ id: "header-link", src: "/assets/header.js" }],
    };

    const links = [{ rel: "icon", href: "/favicon.ico" }];
    const preload = [{ rel: "preload", href: "/font.woff2", as: "font" }];

    jest
      .mocked(resolveScriptsAppRenderContext)
      .mockReturnValue(scripts as never);
    jest
      .mocked(resolveHeadLinksAppRenderContext)
      .mockReturnValue(links as never);
    jest
      .mocked(resolvePreloadAppRenderContext)
      .mockReturnValue(preload as never);

    const result = resolveDocOpenAppRenderContext(appContext, { nonce });

    expect(resolveScriptsAppRenderContext).toHaveBeenCalledWith(appContext, {
      location: "header",
      nonce,
    });
    expect(resolveHeadLinksAppRenderContext).toHaveBeenCalledWith(appContext);
    expect(resolvePreloadAppRenderContext).toHaveBeenCalledWith(appContext);

    expect(result).toEqual({
      metadata: appContext.metadata,
      language: appContext.language,
      canonicalUrl: appContext.canonicalUrl,
      inlineScripts: scripts.inlineScripts,
      linkScripts: scripts.linkScripts,
      links,
      preload,
      nonce,
      themeColour: appContext.themeColour,
    });
  });
});
