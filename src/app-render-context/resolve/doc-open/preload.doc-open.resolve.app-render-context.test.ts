// src/app-render-context/resolve/doc-open/preload.doc-open.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";

import { appRenderContextResolveDocOpenPreload } from "@app-render-context/resolve/doc-open/preload.doc-open.resolve.app-render-context";

describe("appRenderContextResolveDocOpenPreload", () => {
  it("adds preload rel to configured preload assets", () => {
    const appContext = {
      preload: [
        {
          href: "/fonts/site.woff2",
          as: "font",
          type: "font/woff2",
          crossOrigin: "anonymous",
        },
      ],
    } as unknown as AppContext;

    expect(appRenderContextResolveDocOpenPreload(appContext)).toEqual([
      {
        href: "/fonts/site.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
        rel: "preload",
      },
    ]);
  });

  it("preserves an empty preload list", () => {
    const appContext = {
      preload: [],
    } as unknown as AppContext;

    expect(appRenderContextResolveDocOpenPreload(appContext)).toEqual([]);
  });
});
