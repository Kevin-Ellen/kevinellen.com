// tests/src/app-state/resolve/page-content/inline/external.link.resolve.app-state.test.ts

jest.mock("@app-state/resolve/links/external.link.resolve.app-state", () => ({
  appStateResolveExternalLink: jest.fn(),
}));

import { appStateResolveExternalLink } from "@app-state/resolve/links/external.link.resolve.app-state";
import { appStateResolveExternalLinkInlineContent } from "@app-state/resolve/page-content/inline/external-link.resolve.app-state";

import type { AuthoredExternalLinkInlineContent } from "@shared-types/page-content/inline/external-link/authored.external-link.inline-content.page-content.types";
import type { AppStateExternalLinkInlineContent } from "@shared-types/page-content/inline/external-link/app-state.external-link.inline-content.page-content.types";

const mockedAppStateResolveExternalLink =
  appStateResolveExternalLink as jest.MockedFunction<
    typeof appStateResolveExternalLink
  >;

describe("appStateResolveExternalLinkInlineContent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves the nested link through the external link resolver", () => {
    const authoredContent: AuthoredExternalLinkInlineContent = {
      kind: "externalLink",
      link: {
        kind: "external",
        href: "https://example.com",
        text: "Example",
      },
    };

    const resolvedLink = {
      kind: "external",
      href: "https://example.com",
      text: "Example",
      svgId: null,
      behaviour: {
        openInNewTab: true,
      },
    } as const;

    mockedAppStateResolveExternalLink.mockReturnValue(resolvedLink);

    const result = appStateResolveExternalLinkInlineContent(authoredContent);

    expect(mockedAppStateResolveExternalLink).toHaveBeenCalledTimes(1);
    expect(mockedAppStateResolveExternalLink).toHaveBeenCalledWith(
      authoredContent.link,
    );

    const expected: AppStateExternalLinkInlineContent = {
      kind: "externalLink",
      link: resolvedLink,
    };

    expect(result).toEqual(expected);
  });

  it("returns a new wrapper object", () => {
    const authoredContent: AuthoredExternalLinkInlineContent = {
      kind: "externalLink",
      link: {
        kind: "external",
        href: "https://example.com",
        text: "Example",
      },
    };

    const resolvedLink = {
      kind: "external",
      href: "https://example.com",
      text: "Example",
      svgId: null,
      behaviour: {
        openInNewTab: true,
      },
    } as const;

    mockedAppStateResolveExternalLink.mockReturnValue(resolvedLink);

    const result = appStateResolveExternalLinkInlineContent(authoredContent);

    expect(result).not.toBe(authoredContent);
    expect(result.link).toBe(resolvedLink);
  });
});
