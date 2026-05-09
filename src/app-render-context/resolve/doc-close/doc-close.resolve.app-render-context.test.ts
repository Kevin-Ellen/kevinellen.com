// src/app-render-context/resolve/doc-close/doc-close.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";

import { appRenderContextResolveDocClose } from "@app-render-context/resolve/doc-close/doc-close.resolve.app-render-context";
import { appRenderContextResolveScripts } from "@app-render-context/resolve/shared/scripts.assets.resolve.app-render-context";
import { resolveSvgSpritesAppRenderContext } from "@app-render-context/shared/svg.resolve.app-render-context";
import { appRenderContextResolveDocCloseStructuredData } from "@app-render-context/resolve/doc-close/structured-data.doc-close.resolve.app-render-context";

jest.mock(
  "@app-render-context/resolve/shared/scripts.assets.resolve.app-render-context",
  () => ({
    appRenderContextResolveScripts: jest.fn(),
  }),
);

jest.mock("@app-render-context/shared/svg.resolve.app-render-context", () => ({
  resolveSvgSpritesAppRenderContext: jest.fn(),
}));

jest.mock(
  "@app-render-context/resolve/doc-close/structured-data.doc-close.resolve.app-render-context",
  () => ({
    appRenderContextResolveDocCloseStructuredData: jest.fn(),
  }),
);

describe("appRenderContextResolveDocClose", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves footer scripts, SVG sprites, and structured data", () => {
    const appContext = {} as unknown as AppContext;

    jest.mocked(appRenderContextResolveScripts).mockReturnValue({
      inlineScripts: [{ nonce: "nonce-one", content: "console.log(1);" }],
      linkScripts: [{ src: "/script.js", defer: true }],
    } as never);

    jest
      .mocked(resolveSvgSpritesAppRenderContext)
      .mockReturnValue([{ id: "logo", content: "<symbol />" }] as never);

    jest
      .mocked(appRenderContextResolveDocCloseStructuredData)
      .mockReturnValue([
        { "@context": "https://schema.org", "@type": "WebPage" },
      ] as never);

    expect(
      appRenderContextResolveDocClose(appContext, {
        nonce: "nonce-one",
        origin: "https://kevinellen.com",
      }),
    ).toEqual({
      inlineScripts: [{ nonce: "nonce-one", content: "console.log(1);" }],
      linkScripts: [{ src: "/script.js", defer: true }],
      svg: [{ id: "logo", content: "<symbol />" }],
      structuredData: [
        { "@context": "https://schema.org", "@type": "WebPage" },
      ],
    });

    expect(appRenderContextResolveScripts).toHaveBeenCalledWith(appContext, {
      location: "footer",
      nonce: "nonce-one",
    });

    expect(resolveSvgSpritesAppRenderContext).toHaveBeenCalledWith(appContext);

    expect(appRenderContextResolveDocCloseStructuredData).toHaveBeenCalledWith(
      appContext,
      {
        origin: "https://kevinellen.com",
      },
    );
  });
});
