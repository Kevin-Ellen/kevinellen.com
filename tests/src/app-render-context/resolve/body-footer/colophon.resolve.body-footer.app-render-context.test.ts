// tests/src/app-render-context/resolve/body-footer/colophon.resolve.body-footer.app-render-context.test.ts

import { resolveColophonBodyFooterAppRenderContext } from "@app-render-context/resolve/body-footer/colophon.resolve.body-footer.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

describe("resolveColophonBodyFooterAppRenderContext", () => {
  it("resolves all rights reserved colophon items", () => {
    const appContext = {
      globalFooter: {
        colophon: {
          copyrightYear: 2026,
          copyrightName: "Kevin Ellen",
          allRightsReserved: true,
        },
      },
    } as unknown as AppContext;

    const result = resolveColophonBodyFooterAppRenderContext(appContext);

    expect(result).toEqual({
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

  it("resolves some rights reserved colophon items", () => {
    const appContext = {
      globalFooter: {
        colophon: {
          copyrightYear: 2026,
          copyrightName: "Kevin Ellen",
          allRightsReserved: false,
        },
      },
    } as unknown as AppContext;

    const result = resolveColophonBodyFooterAppRenderContext(appContext);

    expect(result).toEqual({
      items: [
        {
          label: "Copyright",
          value: "© 2026 Kevin Ellen",
        },
        {
          label: "Rights",
          value: "Some rights reserved",
        },
      ],
    });
  });
});
