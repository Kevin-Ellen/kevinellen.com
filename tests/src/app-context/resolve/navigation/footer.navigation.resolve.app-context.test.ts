// tests/src/app-context/resolve/navigation/footer.navigation.resolve.app-context.test.ts

import { resolveFooterNavigationAppContext } from "@app-context/resolve/navigation/footer.navigation.resolve.app-context";
import { resolveLinkAppContext } from "@app-context/resolve/shared/links/link.shared.resolve.app-context";

jest.mock(
  "@app-context/resolve/shared/links/link.shared.resolve.app-context",
  () => ({
    resolveLinkAppContext: jest.fn(),
  }),
);

describe("resolveFooterNavigationAppContext", () => {
  const mockedResolveLinkAppContext = jest.mocked(resolveLinkAppContext);

  const appState = {} as never;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves links within each footer section and preserves section fields", () => {
    mockedResolveLinkAppContext
      .mockReturnValueOnce({
        kind: "internal",
        id: "about",
        svgId: null,
        behaviour: { openInNewTab: false },
        href: "/about",
        text: "About",
      })
      .mockReturnValueOnce({
        kind: "social",
        id: "github",
        svgId: null,
        behaviour: { openInNewTab: true },
        href: "https://github.com/example",
        text: "GitHub",
      });

    const navigation = {
      sections: [
        {
          id: "site",
          label: "Site",
          items: [
            {
              kind: "internal",
              id: "about",
              svgId: null,
              behaviour: { openInNewTab: false },
            },
          ],
        },
        {
          id: "elsewhere",
          label: "Elsewhere",
          items: [
            {
              kind: "social",
              id: "github",
              svgId: null,
              behaviour: { openInNewTab: true },
            },
          ],
        },
      ],
    } as const;

    const result = resolveFooterNavigationAppContext(navigation, appState);

    expect(result).toEqual({
      sections: [
        {
          id: "site",
          label: "Site",
          items: [
            {
              kind: "internal",
              id: "about",
              svgId: null,
              behaviour: { openInNewTab: false },
              href: "/about",
              text: "About",
            },
          ],
        },
        {
          id: "elsewhere",
          label: "Elsewhere",
          items: [
            {
              kind: "social",
              id: "github",
              svgId: null,
              behaviour: { openInNewTab: true },
              href: "https://github.com/example",
              text: "GitHub",
            },
          ],
        },
      ],
    });

    expect(mockedResolveLinkAppContext).toHaveBeenCalledTimes(2);
    expect(mockedResolveLinkAppContext).toHaveBeenNthCalledWith(
      1,
      navigation.sections[0].items[0],
      appState,
    );
    expect(mockedResolveLinkAppContext).toHaveBeenNthCalledWith(
      2,
      navigation.sections[1].items[0],
      appState,
    );
  });

  it("returns empty sections when footer navigation is empty", () => {
    const navigation = {
      sections: [],
    } as const;

    const result = resolveFooterNavigationAppContext(navigation, appState);

    expect(result).toEqual({
      sections: [],
    });

    expect(mockedResolveLinkAppContext).not.toHaveBeenCalled();
  });
});
