// tests/src/app-context/resolve/page/content/inline/internal-link.resolve.app-context.test.ts

import { appContextResolveInternalLinkInlineContent } from "@app-context/resolve/page/content/inline/internal-link.resolve.app-context";

describe("appContextResolveInternalLinkInlineContent", () => {
  it("resolves the internal link through the resolver context", () => {
    const content = {
      kind: "internalLink",
      link: {
        kind: "internal",
        id: "about",
        svgId: null,
        behaviour: {
          openInNewTab: false,
        },
      },
    } as const;

    const resolvedLink = {
      kind: "internal",
      id: "about",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
      href: "/about",
      text: "About",
    } as const;

    const context = {
      resolveInternalLink: jest.fn().mockReturnValue(resolvedLink),
    };

    const result = appContextResolveInternalLinkInlineContent(
      content,
      context as never,
    );

    expect(result).toEqual({
      kind: "internalLink",
      link: resolvedLink,
    });

    expect(context.resolveInternalLink).toHaveBeenCalledWith(content.link);
  });
});
