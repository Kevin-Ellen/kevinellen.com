// src/app-context/resolve/shared/links/link.shared.resolve.app-context.test.ts

import type { AppState } from "@app-state/class.app-state";
import type {
  AppStateExternalLink,
  AppStateInternalLink,
  AppStateSocialLink,
} from "@shared-types/links/app-state.links.types";
import type {
  AppContextExternalLink,
  AppContextInternalLink,
} from "@shared-types/links/app-context.links.types";

import { appContextResolveLink } from "./link.shared.resolve.app-context";

import { appContextResolveInternalLink } from "@app-context/resolve/shared/links/internal.link.shared.resolve.app-context";
import { appContextResolveExternalLink } from "@app-context/resolve/shared/links/external.link.shared.resolve.app-context";
import { appContextResolveSocialLink } from "@app-context/resolve/shared/links/social.link.shared.resolve.app-context";

jest.mock(
  "@app-context/resolve/shared/links/internal.link.shared.resolve.app-context",
  () => ({
    appContextResolveInternalLink: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/shared/links/external.link.shared.resolve.app-context",
  () => ({
    appContextResolveExternalLink: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/shared/links/social.link.shared.resolve.app-context",
  () => ({
    appContextResolveSocialLink: jest.fn(),
  }),
);

describe("appContextResolveLink", () => {
  const mockedResolveInternalLinkAppContext = jest.mocked(
    appContextResolveInternalLink,
  );
  const mockedResolveExternalLinkAppContext = jest.mocked(
    appContextResolveExternalLink,
  );
  const mockedResolveSocialLinkAppContext = jest.mocked(
    appContextResolveSocialLink,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves internal links using the internal link resolver", () => {
    const appState = {} as AppState;

    const link: AppStateInternalLink = {
      kind: "internal",
      id: "journal",
      text: null,
      svgId: null,
      behaviour: { openInNewTab: false },
    };

    const resolvedLink = {
      kind: "internal",
      id: "journal",
      href: "/journal",
      text: "Journal",
      svgId: null,
      behaviour: { openInNewTab: false },
    } satisfies AppContextInternalLink;

    mockedResolveInternalLinkAppContext.mockReturnValue(resolvedLink);

    const result = appContextResolveLink(link, appState);

    expect(result).toEqual(resolvedLink);
    expect(mockedResolveInternalLinkAppContext).toHaveBeenCalledWith(
      link,
      appState,
    );
    expect(mockedResolveExternalLinkAppContext).not.toHaveBeenCalled();
    expect(mockedResolveSocialLinkAppContext).not.toHaveBeenCalled();
  });

  it("resolves external links using the external link resolver", () => {
    const appState = {} as AppState;

    const link: AppStateExternalLink = {
      kind: "external",
      href: "https://example.com",
      text: "Example",
      svgId: null,
      behaviour: { openInNewTab: true },
    };

    const resolvedLink = {
      kind: "external",
      href: "https://example.com",
      text: "Example",
      svgId: null,
      behaviour: { openInNewTab: true },
    } satisfies AppContextExternalLink;

    mockedResolveExternalLinkAppContext.mockReturnValue(resolvedLink);

    const result = appContextResolveLink(link, appState);

    expect(result).toEqual(resolvedLink);
    expect(mockedResolveExternalLinkAppContext).toHaveBeenCalledWith(
      link,
      appState,
    );
    expect(mockedResolveInternalLinkAppContext).not.toHaveBeenCalled();
    expect(mockedResolveSocialLinkAppContext).not.toHaveBeenCalled();
  });

  it("resolves social links using the social link resolver", () => {
    const appState = {} as AppState;

    const link: AppStateSocialLink = {
      kind: "social",
      id: "github",
      text: null,
      svgId: "icon-github",
      behaviour: { openInNewTab: true },
    };

    const resolvedLink = {
      kind: "external",
      href: "https://example.com/social",
      text: "GitHub",
      svgId: "icon-github",
      behaviour: { openInNewTab: true },
    } satisfies AppContextExternalLink;

    mockedResolveSocialLinkAppContext.mockReturnValue(resolvedLink);

    const result = appContextResolveLink(link, appState);

    expect(result).toEqual(resolvedLink);
    expect(mockedResolveSocialLinkAppContext).toHaveBeenCalledWith(
      link,
      appState,
    );
    expect(mockedResolveInternalLinkAppContext).not.toHaveBeenCalled();
    expect(mockedResolveExternalLinkAppContext).not.toHaveBeenCalled();
  });
});
