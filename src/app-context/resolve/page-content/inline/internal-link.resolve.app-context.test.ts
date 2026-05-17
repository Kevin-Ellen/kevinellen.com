// src/app-context/resolve/page-content/inline/internal-link.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStateInternalLinkInline } from "@shared-types/page-content/inline/internal-link/app-state.internal-link.inline-content.types";

import { appContextResolveInternalLinkInline } from "@app-context/resolve/page-content/inline/internal-link.resolve.app-context";

describe("appContextResolveInternalLinkInline", () => {
  it("resolves the internal link using the resolver context", () => {
    const content: AppStateInternalLinkInline = {
      kind: "internalLink",
      link: {
        kind: "internal",
        id: "journal",
        text: null,
        svgId: null,
        behaviour: {
          openInNewTab: false,
        },
      },
    };

    const context: AppContextPageContentResolverContext = {
      resolveInternalLink: jest.fn().mockReturnValue({
        kind: "internal",
        id: "journal",
        href: "/journal",
        text: "Journal",
        svgId: null,
        behaviour: {
          openInNewTab: false,
        },
      }),
    } as unknown as AppContextPageContentResolverContext;

    const result = appContextResolveInternalLinkInline(content, context);

    expect(result).toEqual({
      kind: "internalLink",
      link: {
        kind: "internal",
        id: "journal",
        href: "/journal",
        text: "Journal",
        svgId: null,
        behaviour: {
          openInNewTab: false,
        },
      },
    });

    expect(context.resolveInternalLink).toHaveBeenCalledTimes(1);

    expect(context.resolveInternalLink).toHaveBeenCalledWith(content.link);
  });
});
