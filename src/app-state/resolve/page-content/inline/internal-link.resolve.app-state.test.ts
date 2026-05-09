// src/app-state/resolve/page-content/inline/internal-link.resolve.app-state.test.ts

import { appStateResolveInternalLinkInline } from "@app-state/resolve/page-content/inline/internal-link.resolve.app-state";

import { appStateResolveInternalLink } from "@app-state/resolve/links/internal.link.resolve.app-state";

jest.mock("@app-state/resolve/links/internal.link.resolve.app-state", () => ({
  appStateResolveInternalLink: jest.fn(),
}));

describe("appStateResolveInternalLinkInline", () => {
  const mockedAppStateResolveInternalLink = jest.mocked(
    appStateResolveInternalLink,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves internal link inline content", () => {
    const link = {
      kind: "internal",
      id: "journal",
    };

    const resolvedLink = {
      kind: "internal",
      id: "journal",
      text: null,
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    mockedAppStateResolveInternalLink.mockReturnValue(resolvedLink as never);

    expect(
      appStateResolveInternalLinkInline({
        kind: "internalLink",
        link,
      } as never),
    ).toEqual({
      kind: "internalLink",
      link: resolvedLink,
    });

    expect(mockedAppStateResolveInternalLink).toHaveBeenCalledWith(link);
  });

  it("throws when the internal link id is missing", () => {
    expect(() =>
      appStateResolveInternalLinkInline({
        kind: "internalLink",
        link: {
          kind: "internal",
        },
      } as never),
    ).toThrow("Invalid internal link: missing id in inline content");

    expect(mockedAppStateResolveInternalLink).not.toHaveBeenCalled();
  });
});
