// tests/src/app-state/resolve/page-content/inline/internal.link.resolve.app-state.test.ts

import { appStateResolveInternalLinkInlineContent } from "@app-state/resolve/page-content/inline/internal-link.resolve.app-state";

import type { AuthoredInternalLinkInlineContent } from "@shared-types/page-content/inline/internal-link/authored.internal-link.inline-content.page-content.types";
import type { AppStateInternalLinkInlineContent } from "@shared-types/page-content/inline/internal-link/app-state.internal-link.inline-content.page-content.types";

describe("appStateResolveInternalLinkInlineContent", () => {
  it("resolves the nested internal link deterministically", () => {
    const authoredContent: AuthoredInternalLinkInlineContent = {
      kind: "internalLink",
      link: {
        kind: "internal",
        id: "about",
      },
    };

    const result = appStateResolveInternalLinkInlineContent(authoredContent);

    const expected: AppStateInternalLinkInlineContent = {
      kind: "internalLink",
      link: {
        kind: "internal",
        id: "about",
        svgId: null,
        behaviour: {
          openInNewTab: false,
        },
      },
    };

    expect(result).toEqual(expected);
  });

  it("returns a new wrapper object and a new resolved link object", () => {
    const authoredContent: AuthoredInternalLinkInlineContent = {
      kind: "internalLink",
      link: {
        kind: "internal",
        id: "home",
      },
    };

    const result = appStateResolveInternalLinkInlineContent(authoredContent);

    expect(result).not.toBe(authoredContent);
    expect(result.link).not.toBe(authoredContent.link);
    expect(result.link).toEqual({
      kind: "internal",
      id: "home",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    });
  });
});
