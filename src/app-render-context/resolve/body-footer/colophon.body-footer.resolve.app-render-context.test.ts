// src/app-render-context/resolve/body-footer/colophon.body-footer.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";

import { appRenderContextResolveBodyFooterColophon } from "@app-render-context/resolve/body-footer/colophon.body-footer.resolve.app-render-context";

describe("appRenderContextResolveBodyFooterColophon", () => {
  it("resolves a footer colophon with all rights reserved", () => {
    const appContext = {
      globalFooter: {
        colophon: {
          copyrightYear: 2026,
          copyrightName: "Kevin Ellen",
          allRightsReserved: true,
        },
      },
    } as unknown as AppContext;

    expect(appRenderContextResolveBodyFooterColophon(appContext)).toEqual({
      items: [
        {
          label: "Copyright",
          value: "© 2026 Kevin Ellen",
        },
        {
          label: "Rights",
          value: "All rights reserved",
        },
      ],
    });
  });

  it("resolves a footer colophon with some rights reserved", () => {
    const appContext = {
      globalFooter: {
        colophon: {
          copyrightYear: 2026,
          copyrightName: "Photography Duck",
          allRightsReserved: false,
        },
      },
    } as unknown as AppContext;

    expect(appRenderContextResolveBodyFooterColophon(appContext)).toEqual({
      items: [
        {
          label: "Copyright",
          value: "© 2026 Photography Duck",
        },
        {
          label: "Rights",
          value: "Some rights reserved",
        },
      ],
    });
  });
});
