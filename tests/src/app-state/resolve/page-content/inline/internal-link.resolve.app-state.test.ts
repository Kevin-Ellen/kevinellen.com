// tests/src/app-state/resolve/page-content/inline/internal-link.resolve.app-state.test.ts

jest.mock("@app-state/resolve/links/internal-link.resolve.app-state", () => ({
  appStateResolveInternalLink: jest.fn(),
}));

import { appStateResolveInternalLink } from "@app-state/resolve/links/internal.link.resolve.app-state";
import { appStateResolveInternalLinkInlineContent } from "@app-state/resolve/page-content/inline/internal-link.resolve.app-state";

import type { AuthoredInternalLinkInlineContent } from "@shared-types/page-content/inline/internal-link/authored.internal-link.inline-content.page-content.types";
import type { AppStateInternalLinkInlineContent } from "@shared-types/page-content/inline/internal-link/app-state.internal-link.inline-content.page-content.types";

const mockedAppStateResolveInternalLink =
  appStateResolveInternalLink as jest.MockedFunction<
    typeof appStateResolveInternalLink
  >;

describe("appStateResolveInternalLinkInlineContent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves the nested link through the internal link resolver", () => {
    const authoredContent: AuthoredInternalLinkInlineContent = {
      kind: "internalLink",
      link: {
        kind: "internal",
        id: "about",
      },
    };

    const resolvedLink = {
      kind: "internal",
      id: "about",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    } as const;

    mockedAppStateResolveInternalLink.mockReturnValue(resolvedLink);

    const result = appStateResolveInternalLinkInlineContent(authoredContent);

    expect(mockedAppStateResolveInternalLink).toHaveBeenCalledTimes(1);
    expect(mockedAppStateResolveInternalLink).toHaveBeenCalledWith(
      authoredContent.link,
    );

    const expected: AppStateInternalLinkInlineContent = {
      kind: "internalLink",
      link: resolvedLink,
    };

    expect(result).toEqual(expected);
  });

  it("returns a new wrapper object", () => {
    const authoredContent: AuthoredInternalLinkInlineContent = {
      kind: "internalLink",
      link: {
        kind: "internal",
        id: "home",
      },
    };

    const resolvedLink = {
      kind: "internal",
      id: "home",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    } as const;

    mockedAppStateResolveInternalLink.mockReturnValue(resolvedLink);

    const result = appStateResolveInternalLinkInlineContent(authoredContent);

    expect(result).not.toBe(authoredContent);
    expect(result.link).toBe(resolvedLink);
  });
});
