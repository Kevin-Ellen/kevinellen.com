// tests/src/app-render-context/resolve/body-content/inline/external-link.resolve.app-render-context.test.ts

import { resolveExternalLinkInlineContentAppRenderContext } from "@app-render-context/resolve/body-content/inline/external-link.resolve.app-render-context";
import { resolveLinkAppRenderContext } from "@app-render-context/shared/link.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextExternalLinkInlineContent } from "@shared-types/page-content/inline/external-link/app-context.external-link.inline-content.page-content.types";

jest.mock("@app-render-context/shared/link.resolve.app-render-context", () => ({
  resolveLinkAppRenderContext: jest.fn(),
}));

describe("resolveExternalLinkInlineContentAppRenderContext", () => {
  it("resolves external link inline content into render link content", () => {
    const appContext = {} as AppContext;

    const link = {
      kind: "external",
      href: "https://example.com",
      text: "Example",
      svgId: null,
      behaviour: {
        openInNewTab: true,
      },
    };

    const module = {
      kind: "externalLink",
      link,
    } as unknown as AppContextExternalLinkInlineContent;

    const resolvedLink = {
      kind: "external",
      href: "https://example.com",
      text: "Example",
      openInNewTab: true,
      svg: null,
    } as const;

    jest.mocked(resolveLinkAppRenderContext).mockReturnValue(resolvedLink);

    const result = resolveExternalLinkInlineContentAppRenderContext(
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
