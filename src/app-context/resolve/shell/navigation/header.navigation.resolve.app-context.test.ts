// src/app-context/resolve/shell/navigation/header.navigation.resolve.app-context.test.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppStateHeaderNavigation } from "@shared-types/config/navigation/header/app-state.header.navigation.types";

import { appContextResolveHeaderNavigation } from "@app-context/resolve/shell/navigation/header.navigation.resolve.app-context";

import { appContextResolveLink } from "@app-context/resolve/shared/links/link.shared.resolve.app-context";

jest.mock(
  "@app-context/resolve/shared/links/link.shared.resolve.app-context",
  () => ({
    appContextResolveLink: jest.fn(),
  }),
);

describe("appContextResolveHeaderNavigation", () => {
  const mockedAppContextResolveLink = jest.mocked(appContextResolveLink);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves primary and social navigation links", () => {
    const appState = {} as AppState;

    const navigation: AppStateHeaderNavigation = {
      primary: [
        {
          kind: "internal",
          id: "journal",
          text: null,
          svgId: null,
          behaviour: {
            openInNewTab: false,
          },
        },
      ],
      social: [
        {
          kind: "social",
          id: "github",
          text: null,
          svgId: "icon-github",
          behaviour: {
            openInNewTab: true,
          },
        },
      ],
    };

    mockedAppContextResolveLink
      .mockReturnValueOnce({
        kind: "internal",
        id: "journal",
        href: "/journal",
        text: "Journal",
        svgId: null,
        behaviour: {
          openInNewTab: false,
        },
      })
      .mockReturnValueOnce({
        kind: "external",
        href: "https://github.com/example",
        text: "GitHub",
        svgId: "icon-github",
        behaviour: {
          openInNewTab: true,
        },
      });

    const result = appContextResolveHeaderNavigation(navigation, appState);

    expect(result).toEqual({
      primary: [
        {
          kind: "internal",
          id: "journal",
          href: "/journal",
          text: "Journal",
          svgId: null,
          behaviour: {
            openInNewTab: false,
          },
        },
      ],
      social: [
        {
          kind: "external",
          href: "https://github.com/example",
          text: "GitHub",
          svgId: "icon-github",
          behaviour: {
            openInNewTab: true,
          },
        },
      ],
    });

    expect(mockedAppContextResolveLink).toHaveBeenCalledTimes(2);

    expect(mockedAppContextResolveLink).toHaveBeenNthCalledWith(
      1,
      navigation.primary[0],
      appState,
    );

    expect(mockedAppContextResolveLink).toHaveBeenNthCalledWith(
      2,
      navigation.social[0],
      appState,
    );
  });

  it("returns empty navigation groups without resolving links", () => {
    const appState = {} as AppState;

    const navigation: AppStateHeaderNavigation = {
      primary: [],
      social: [],
    };

    const result = appContextResolveHeaderNavigation(navigation, appState);

    expect(result).toEqual({
      primary: [],
      social: [],
    });

    expect(mockedAppContextResolveLink).not.toHaveBeenCalled();
  });
});
