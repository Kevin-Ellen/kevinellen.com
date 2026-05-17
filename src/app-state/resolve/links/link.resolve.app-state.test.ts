// src/app-state/resolve/links/link.resolve.app-state.test.ts

import { resolveLinkAppState } from "@app-state/resolve/links/link.resolve.app-state";

import { appStateResolveInternalLink } from "@app-state/resolve/links/internal.link.resolve.app-state";
import { appStateResolveExternalLink } from "@app-state/resolve/links/external.link.resolve.app-state";
import { appStateResolveSocialLink } from "@app-state/resolve/links/social.link.resolve.app-state";

jest.mock("@app-state/resolve/links/internal.link.resolve.app-state", () => ({
  appStateResolveInternalLink: jest.fn(),
}));

jest.mock("@app-state/resolve/links/external.link.resolve.app-state", () => ({
  appStateResolveExternalLink: jest.fn(),
}));

jest.mock("@app-state/resolve/links/social.link.resolve.app-state", () => ({
  appStateResolveSocialLink: jest.fn(),
}));

describe("resolveLinkAppState", () => {
  const mockedAppStateResolveInternalLink = jest.mocked(
    appStateResolveInternalLink,
  );
  const mockedAppStateResolveExternalLink = jest.mocked(
    appStateResolveExternalLink,
  );
  const mockedAppStateResolveSocialLink = jest.mocked(
    appStateResolveSocialLink,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("delegates internal links to the internal link resolver", () => {
    const link = {
      kind: "internal",
      id: "home",
    };

    const resolvedLink = {
      kind: "internal",
      id: "home",
      text: null,
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    mockedAppStateResolveInternalLink.mockReturnValue(resolvedLink as never);

    expect(resolveLinkAppState(link as never)).toBe(resolvedLink);
    expect(mockedAppStateResolveInternalLink).toHaveBeenCalledWith(link);
  });

  it("delegates external links to the external link resolver", () => {
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

    expect(resolveLinkAppState(link as never)).toBe(resolvedLink);
    expect(mockedAppStateResolveExternalLink).toHaveBeenCalledWith(link);
  });

  it("delegates social links to the social link resolver", () => {
    const link = {
      kind: "social",
      id: "github",
    };

    const resolvedLink = {
      kind: "social",
      id: "github",
      text: null,
      svgId: null,
      behaviour: {
        openInNewTab: true,
      },
    };

    mockedAppStateResolveSocialLink.mockReturnValue(resolvedLink as never);

    expect(resolveLinkAppState(link as never)).toBe(resolvedLink);
    expect(mockedAppStateResolveSocialLink).toHaveBeenCalledWith(link);
  });
});
