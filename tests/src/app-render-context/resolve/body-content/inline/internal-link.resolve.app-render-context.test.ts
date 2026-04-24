// tests/src/app-render-context/resolve/body-content/inline/internal-link.resolve.app-render-context.test.ts

import { resolveInternalLinkInlineContentAppRenderContext } from "@app-render-context/resolve/body-content/inline/internal-link.resolve.app-render-context";
import { resolveLinkAppRenderContext } from "@app-render-context/shared/link.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextInternalLinkInlineContent } from "@shared-types/page-content/inline/internal-link/app-context.internal-link.inline-content.page-content.types";

jest.mock("@app-render-context/shared/link.resolve.app-render-context", () => ({
  resolveLinkAppRenderContext: jest.fn(),
}));

describe("resolveInternalLinkInlineContentAppRenderContext", () => {
  it("resolves internal link inline content into render link content", () => {
    const appContext = {} as AppContext;

    const link = {
      kind: "internal",
      id: "about",
      href: "/about",
      text: "About",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    const module = {
      kind: "internalLink",
      link,
    } as unknown as AppContextInternalLinkInlineContent;

    const resolvedLink = {
      kind: "internal",
      href: "/about",
      text: "About",
      openInNewTab: false,
      svg: null,
    } as const;

    jest.mocked(resolveLinkAppRenderContext).mockReturnValue(resolvedLink);

    const result = resolveInternalLinkInlineContentAppRenderContext(
      appContext,
      module,
    );

    expect(resolveLinkAppRenderContext).toHaveBeenCalledWith(appContext, link);

    expect(result).toEqual({
      kind: "link",
      link: resolvedLink,
    });
  });
});
