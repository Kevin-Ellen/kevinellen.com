// src/app-state/resolve/page-content/inline/external-link.resolve.app-state.test.ts

import { appStateResolveExternalLinkInline } from "@app-state/resolve/page-content/inline/external-link.resolve.app-state";

import { appStateResolveExternalLink } from "@app-state/resolve/links/external.link.resolve.app-state";

jest.mock("@app-state/resolve/links/external.link.resolve.app-state", () => ({
  appStateResolveExternalLink: jest.fn(),
}));

describe("appStateResolveExternalLinkInline", () => {
  const mockedAppStateResolveExternalLink = jest.mocked(
    appStateResolveExternalLink,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves external link inline content", () => {
    const link = {
      kind: "external",
      href: "https://example.com",
      text: "Example",
    };

    const resolvedLink = {
      kind: "external",
      href: "https://example.com",
      text: "Example",
      svgId: null,
      behaviour: {
        openInNewTab: true,
      },
    };

    mockedAppStateResolveExternalLink.mockReturnValue(resolvedLink as never);

    expect(
      appStateResolveExternalLinkInline({
        kind: "externalLink",
        link,
      } as never),
    ).toEqual({
      kind: "externalLink",
      link: resolvedLink,
    });

    expect(mockedAppStateResolveExternalLink).toHaveBeenCalledWith(link);
  });
});
