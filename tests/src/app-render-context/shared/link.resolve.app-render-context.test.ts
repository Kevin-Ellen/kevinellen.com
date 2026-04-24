// tests/src/app-render-context/shared/link.resolve.app-render-context.test.ts

import { resolveLinkAppRenderContext } from "@app-render-context/shared/link.resolve.app-render-context";
import { resolveInternalLinkAppRenderContext } from "@app-render-context/shared/internal.link.resolve.app-render-context";
import { resolveSvgReferenceByIdAppRenderContext } from "@app-render-context/shared/svg-reference-by-id.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextLink } from "@shared-types/links/app-context.links.types";

jest.mock(
  "@app-render-context/shared/internal.link.resolve.app-render-context",
  () => ({
    resolveInternalLinkAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/shared/svg-reference-by-id.resolve.app-render-context",
  () => ({
    resolveSvgReferenceByIdAppRenderContext: jest.fn(),
  }),
);

describe("resolveLinkAppRenderContext", () => {
  const appContext = {} as AppContext;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("delegates internal links to the internal link resolver", () => {
    const link: AppContextLink = {
      kind: "internal",
      id: "about",
      href: "/about",
      text: "About",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    const resolved = {
      kind: "internal",
      href: "/about",
      text: "About",
      openInNewTab: false,
      svg: null,
    } as const;

    jest.mocked(resolveInternalLinkAppRenderContext).mockReturnValue(resolved);

    const result = resolveLinkAppRenderContext(appContext, link);

    expect(resolveInternalLinkAppRenderContext).toHaveBeenCalledWith(
      appContext,
      link,
    );
    expect(result).toBe(resolved);
  });

  it("resolves external links", () => {
    const link: AppContextLink = {
      kind: "external",
      href: "https://example.com",
      text: "Example",
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

    const result = resolveLinkAppRenderContext(appContext, link);

    expect(resolveSvgReferenceByIdAppRenderContext).toHaveBeenCalledWith(
      appContext,
      "icon-home",
    );

    expect(result).toEqual({
      kind: "external",
      href: "https://example.com",
      text: "Example",
      openInNewTab: false,
      svg,
    });
  });

  it("forces social links to open in a new tab", () => {
    const link: AppContextLink = {
      kind: "social",
      id: "github",
      href: "https://github.com/Kevin-Ellen",
      text: "GitHub",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    jest.mocked(resolveSvgReferenceByIdAppRenderContext).mockReturnValue(null);

    const result = resolveLinkAppRenderContext(appContext, link);

    expect(resolveSvgReferenceByIdAppRenderContext).toHaveBeenCalledWith(
      appContext,
      null,
    );

    expect(result).toEqual({
      kind: "social",
      href: "https://github.com/Kevin-Ellen",
      text: "GitHub",
      openInNewTab: true,
      svg: null,
    });
  });
});
