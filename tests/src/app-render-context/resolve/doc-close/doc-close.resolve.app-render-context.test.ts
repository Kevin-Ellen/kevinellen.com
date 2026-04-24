// tests/src/app-render-context/resolve/doc-close/doc-close.resolve.app-render-context.test.ts

import { resolveDocCloseAppRenderContext } from "@app-render-context/resolve/doc-close/doc-close.resolve.app-render-context";
import { resolveScriptsAppRenderContext } from "@app-render-context/resolve/shared/scripts.assets.resolve.app-render-context";
import { resolveSvgSpritesAppRenderContext } from "@app-render-context/shared/svg.resolve.app-render-context";
import { resolveStructuredDataAppRenderContext } from "@app-render-context/resolve/doc-close/structured-data.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

jest.mock(
  "@app-render-context/resolve/shared/scripts.assets.resolve.app-render-context",
  () => ({
    resolveScriptsAppRenderContext: jest.fn(),
  }),
);

jest.mock("@app-render-context/shared/svg.resolve.app-render-context", () => ({
  resolveSvgSpritesAppRenderContext: jest.fn(),
}));

jest.mock(
  "@app-render-context/resolve/doc-close/structured-data.resolve.app-render-context",
  () => ({
    resolveStructuredDataAppRenderContext: jest.fn(),
  }),
);

describe("resolveDocCloseAppRenderContext", () => {
  it("resolves footer scripts, SVG sprites, and structured data", () => {
    const appContext = {} as AppContext;
    const nonce = "test-nonce";

    const scripts = {
      inlineScripts: [
        {
          id: "footer-inline",
          content: "console.log('footer');",
          nonce,
        },
      ],
      linkScripts: [
        {
          id: "footer-link",
          src: "/assets/footer.js",
        },
      ],
    };

    const svg = [
      {
        id: "icon-home",
        viewBox: "0 0 100 100",
        content: "<path />",
      },
    ];

    const structuredData = [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
      },
    ];

    jest
      .mocked(resolveScriptsAppRenderContext)
      .mockReturnValue(scripts as never);
    jest
      .mocked(resolveSvgSpritesAppRenderContext)
      .mockReturnValue(svg as never);
    jest
      .mocked(resolveStructuredDataAppRenderContext)
      .mockReturnValue(structuredData as never);

    const result = resolveDocCloseAppRenderContext(appContext, { nonce });

    expect(resolveScriptsAppRenderContext).toHaveBeenCalledWith(appContext, {
      location: "footer",
      nonce,
    });
    expect(resolveSvgSpritesAppRenderContext).toHaveBeenCalledWith(appContext);
    expect(resolveStructuredDataAppRenderContext).toHaveBeenCalledWith(
      appContext,
    );

    expect(result).toEqual({
      inlineScripts: scripts.inlineScripts,
      linkScripts: scripts.linkScripts,
      svg,
      structuredData,
    });
  });
});
