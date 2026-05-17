// src/app-context/resolve/navigation/navigation.resolve.app-context.test.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppStateNavigation } from "@shared-types/config/navigation/app-state.navigation.types";

import { appContextResolveNavigation } from "@app-context/resolve/shell/navigation/navigation.resolve.app-context";

import { appContextResolveHeaderNavigation } from "@app-context/resolve/shell/navigation/header.navigation.resolve.app-context";
import { appContextResolveFooterNavigation } from "@app-context/resolve/shell/navigation/footer.navigation.resolve.app-context";

jest.mock(
  "@app-context/resolve/shell/navigation/header.navigation.resolve.app-context",
  () => ({
    appContextResolveHeaderNavigation: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/shell/navigation/footer.navigation.resolve.app-context",
  () => ({
    appContextResolveFooterNavigation: jest.fn(),
  }),
);

describe("appContextResolveNavigation", () => {
  const mockedAppContextResolveHeaderNavigation = jest.mocked(
    appContextResolveHeaderNavigation,
  );

  const mockedAppContextResolveFooterNavigation = jest.mocked(
    appContextResolveFooterNavigation,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves header and footer navigation", () => {
    const appState = {} as AppState;

    const navigation: AppStateNavigation = {
      header: {
        primary: [],
        social: [],
      },
      footer: {
        sections: [],
      },
    };

    mockedAppContextResolveHeaderNavigation.mockReturnValue({
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
      social: [],
    });

    mockedAppContextResolveFooterNavigation.mockReturnValue({
      sections: [
        {
          id: "site",
          label: "Explore",
          items: [],
        },
      ],
    });

    const result = appContextResolveNavigation(navigation, appState);

    expect(result).toEqual({
      header: {
        primary: [
          {
            kind: "internal",
            id: "journal",
            href: "/journal",
            text: "Journal",
            svgId: null,
            behaviour: { openInNewTab: false },
          },
        ],
        social: [],
      },
      footer: {
        sections: [
          {
            id: "site",
            label: "Explore",
            items: [],
          },
        ],
      },
    });

    expect(mockedAppContextResolveHeaderNavigation).toHaveBeenCalledTimes(1);

    expect(mockedAppContextResolveHeaderNavigation).toHaveBeenCalledWith(
      navigation.header,
      appState,
    );

    expect(mockedAppContextResolveFooterNavigation).toHaveBeenCalledTimes(1);

    expect(mockedAppContextResolveFooterNavigation).toHaveBeenCalledWith(
      navigation.footer,
      appState,
    );
  });
});
