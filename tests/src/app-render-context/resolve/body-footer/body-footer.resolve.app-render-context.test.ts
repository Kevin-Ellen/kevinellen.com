// tests/src/app-render-context/resolve/body-footer/body-footer.resolve.app-render-context.test.ts

import { resolveBodyFooterAppRenderContext } from "@app-render-context/resolve/body-footer/body-footer.resolve.app-render-context";
import { resolveNavBodyFooterAppRenderContext } from "@app-render-context/resolve/body-footer/nav.resolve.body-footer.app-render-context";
import { resolveAffiliationsBodyFooterAppRenderContext } from "@app-render-context/resolve/body-footer/affiliations.resolve.body-footer.app-render-context";
import { resolveColophonBodyFooterAppRenderContext } from "@app-render-context/resolve/body-footer/colophon.resolve.body-footer.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

jest.mock(
  "@app-render-context/resolve/body-footer/nav.resolve.body-footer.app-render-context",
  () => ({
    resolveNavBodyFooterAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-footer/affiliations.resolve.body-footer.app-render-context",
  () => ({
    resolveAffiliationsBodyFooterAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-footer/colophon.resolve.body-footer.app-render-context",
  () => ({
    resolveColophonBodyFooterAppRenderContext: jest.fn(),
  }),
);

describe("resolveBodyFooterAppRenderContext", () => {
  it("composes body footer sections", () => {
    const appContext = {} as AppContext;

    const nav = {
      sections: [],
    };

    const affiliations = {
      items: [],
    };

    const colophon = {
      items: [],
    };

    jest.mocked(resolveNavBodyFooterAppRenderContext).mockReturnValue(nav);
    jest
      .mocked(resolveAffiliationsBodyFooterAppRenderContext)
      .mockReturnValue(affiliations);
    jest
      .mocked(resolveColophonBodyFooterAppRenderContext)
      .mockReturnValue(colophon);

    const result = resolveBodyFooterAppRenderContext(appContext);

    expect(resolveNavBodyFooterAppRenderContext).toHaveBeenCalledWith(
      appContext,
    );
    expect(resolveAffiliationsBodyFooterAppRenderContext).toHaveBeenCalledWith(
      appContext,
    );
    expect(resolveColophonBodyFooterAppRenderContext).toHaveBeenCalledWith(
      appContext,
    );

    expect(result).toEqual({
      nav,
      affiliations,
      colophon,
    });
  });
});
