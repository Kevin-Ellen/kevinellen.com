// tests/src/app-render-context/shared/internal.link.resolve.app-render-context.test.ts

import { resolveInternalLinkAppRenderContext } from "@app-render-context/shared/internal.link.resolve.app-render-context";
import { resolveSvgReferenceByIdAppRenderContext } from "@app-render-context/shared/svg-reference-by-id.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextInternalLink } from "@shared-types/links/app-context.links.types";

jest.mock(
  "@app-render-context/shared/svg-reference-by-id.resolve.app-render-context",
  () => ({
    resolveSvgReferenceByIdAppRenderContext: jest.fn(),
  }),
);

describe("resolveInternalLinkAppRenderContext", () => {
  it("resolves an internal link for the render context", () => {
    const appContext = {} as AppContext;

    const link: AppContextInternalLink = {
      kind: "internal",
      href: "/about",
      text: "About",
      id: "about",
      svgId: "icon-home",
      behaviour: {
        openInNewTab: false,
      },
    };

    const svg = {
      id: "icon-home",
      width: 100,
      height: 100,
    } as const;

    jest.mocked(resolveSvgReferenceByIdAppRenderContext).mockReturnValue(svg);

    const result = resolveInternalLinkAppRenderContext(appContext, link);

    expect(resolveSvgReferenceByIdAppRenderContext).toHaveBeenCalledWith(
      appContext,
      "icon-home",
    );

    expect(result).toEqual({
      kind: "internal",
      href: "/about",
      text: "About",
      openInNewTab: false,
      svg,
    });
  });

  it("preserves null svg references", () => {
    const appContext = {} as AppContext;

    const link: AppContextInternalLink = {
      kind: "internal",
      href: "/about",
      text: "About",
      id: "about",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    jest.mocked(resolveSvgReferenceByIdAppRenderContext).mockReturnValue(null);

    const result = resolveInternalLinkAppRenderContext(appContext, link);

    expect(resolveSvgReferenceByIdAppRenderContext).toHaveBeenCalledWith(
      appContext,
      null,
    );

    expect(result).toEqual({
      kind: "internal",
      href: "/about",
      text: "About",
      openInNewTab: false,
      svg: null,
    });
  });
});
