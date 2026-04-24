// tests/src/app-render-context/resolve/doc-open/preload.resolve.app-render-context.test.ts

import { resolvePreloadAppRenderContext } from "@app-render-context/resolve/doc-open/preload.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

describe("resolvePreloadAppRenderContext", () => {
  it("adds rel preload to configured preload assets", () => {
    const appContext = {
      preload: [
        {
          href: "/assets/fonts/source-sans/sourcesans3-regular.woff2",
          as: "font",
          type: "font/woff2",
          crossorigin: "anonymous",
        },
      ],
    } as unknown as AppContext;

    const result = resolvePreloadAppRenderContext(appContext);

    expect(result).toEqual([
      {
        href: "/assets/fonts/source-sans/sourcesans3-regular.woff2",
        as: "font",
        type: "font/woff2",
        crossorigin: "anonymous",
        rel: "preload",
      },
    ]);
  });

  it("returns an empty array when no preload assets exist", () => {
    const appContext = {
      preload: [],
    } as unknown as AppContext;

    const result = resolvePreloadAppRenderContext(appContext);

    expect(result).toEqual([]);
  });
});
