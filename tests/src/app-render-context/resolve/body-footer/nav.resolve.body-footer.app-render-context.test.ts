// tests/src/app-render-context/resolve/body-footer/nav.resolve.body-footer.app-render-context.test.ts

import { resolveNavBodyFooterAppRenderContext } from "@app-render-context/resolve/body-footer/nav.resolve.body-footer.app-render-context";
import { resolveLinkAppRenderContext } from "@app-render-context/shared/link.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

jest.mock("@app-render-context/shared/link.resolve.app-render-context", () => ({
  resolveLinkAppRenderContext: jest.fn(),
}));

describe("resolveNavBodyFooterAppRenderContext", () => {
  it("resolves footer navigation sections and items", () => {
    const navItem = {
      kind: "internal",
      id: "about",
      href: "/about",
      text: "About",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    const appContext = {
      navigation: {
        footer: {
          sections: [
            {
              id: "site",
              label: "Site",
              items: [navItem],
            },
          ],
        },
      },
    } as unknown as AppContext;

    const resolvedItem = {
      kind: "internal",
      href: "/about",
      text: "About",
      openInNewTab: false,
      svg: null,
    } as const;

    jest.mocked(resolveLinkAppRenderContext).mockReturnValue(resolvedItem);

    const result = resolveNavBodyFooterAppRenderContext(appContext);

    expect(resolveLinkAppRenderContext).toHaveBeenCalledWith(
      appContext,
      navItem,
    );

    expect(result).toEqual({
      sections: [
        {
          id: "site",
          label: "Site",
          items: [resolvedItem],
        },
      ],
    });
  });

  it("handles empty footer navigation sections", () => {
    const appContext = {
      navigation: {
        footer: {
          sections: [],
        },
      },
    } as unknown as AppContext;

    const result = resolveNavBodyFooterAppRenderContext(appContext);

    expect(resolveLinkAppRenderContext).not.toHaveBeenCalled();

    expect(result).toEqual({
      sections: [],
    });
  });
});
