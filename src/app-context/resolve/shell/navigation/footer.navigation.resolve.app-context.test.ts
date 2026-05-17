// src/app-context/resolve/shell/navigation/footer.navigation.resolve.app-context.test.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppStateFooterNavigation } from "@shared-types/config/navigation/footer/app-state.footer.navigation.types";

import { appContextResolveFooterNavigation } from "@app-context/resolve/shell/navigation/footer.navigation.resolve.app-context";

import { appContextResolveLink } from "@app-context/resolve/shared/links/link.shared.resolve.app-context";

jest.mock(
  "@app-context/resolve/shared/links/link.shared.resolve.app-context",
  () => ({
    appContextResolveLink: jest.fn(),
  }),
);

describe("appContextResolveFooterNavigation", () => {
  const mockedAppContextResolveLink = jest.mocked(appContextResolveLink);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves all footer navigation links", () => {
    const appState = {} as AppState;

    const navigation: AppStateFooterNavigation = {
      sections: [
        {
          id: "site",
          label: "Explore",
          items: [
            {
              kind: "internal",
              id: "journal",
              text: null,
              svgId: null,
              behaviour: { openInNewTab: false },
            },
            {
              kind: "internal",
              id: "articles",
              text: null,
              svgId: null,
              behaviour: { openInNewTab: false },
            },
          ],
        },
        {
          id: "elsewhere",
          label: "External",
          items: [
            {
              kind: "external",
              href: "https://example.com",
              text: "Example",
              svgId: null,
              behaviour: { openInNewTab: true },
            },
          ],
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
        behaviour: { openInNewTab: false },
      })
      .mockReturnValueOnce({
        kind: "internal",
        id: "articles",
        href: "/articles",
        text: "Articles",
        svgId: null,
        behaviour: { openInNewTab: false },
      })
      .mockReturnValueOnce({
        kind: "external",
        href: "https://example.com",
        text: "Example",
        svgId: null,
        behaviour: { openInNewTab: true },
      });

    const result = appContextResolveFooterNavigation(navigation, appState);

    expect(result).toEqual({
      sections: [
        {
          id: "site",
          label: "Explore",
          items: [
            {
              kind: "internal",
              id: "journal",
              href: "/journal",
              text: "Journal",
              svgId: null,
              behaviour: { openInNewTab: false },
            },
            {
              kind: "internal",
              id: "articles",
              href: "/articles",
              text: "Articles",
              svgId: null,
              behaviour: { openInNewTab: false },
            },
          ],
        },
        {
          id: "elsewhere",
          label: "External",
          items: [
            {
              kind: "external",
              href: "https://example.com",
              text: "Example",
              svgId: null,
              behaviour: { openInNewTab: true },
            },
          ],
        },
      ],
    });

    expect(mockedAppContextResolveLink).toHaveBeenCalledTimes(3);

    expect(mockedAppContextResolveLink).toHaveBeenNthCalledWith(
      1,
      navigation.sections[0].items[0],
      appState,
    );

    expect(mockedAppContextResolveLink).toHaveBeenNthCalledWith(
      2,
      navigation.sections[0].items[1],
      appState,
    );

    expect(mockedAppContextResolveLink).toHaveBeenNthCalledWith(
      3,
      navigation.sections[1].items[0],
      appState,
    );
  });

  it("preserves empty sections without resolving links", () => {
    const appState = {} as AppState;

    const navigation: AppStateFooterNavigation = {
      sections: [
        {
          id: "site",
          label: "Empty",
          items: [],
        },
      ],
    };

    const result = appContextResolveFooterNavigation(navigation, appState);

    expect(result).toEqual({
      sections: [
        {
          id: "site",
          label: "Empty",
          items: [],
        },
      ],
    });

    expect(mockedAppContextResolveLink).not.toHaveBeenCalled();
  });

  it("returns empty sections when no footer navigation sections exist", () => {
    const appState = {} as AppState;

    const navigation: AppStateFooterNavigation = {
      sections: [],
    };

    const result = appContextResolveFooterNavigation(navigation, appState);

    expect(result).toEqual({
      sections: [],
    });

    expect(mockedAppContextResolveLink).not.toHaveBeenCalled();
  });
});
