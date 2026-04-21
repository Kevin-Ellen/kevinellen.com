// tests/src/app-context/resolve/navigation/header.navigation.resolve.app-context.test.ts

import { resolveHeaderNavigationAppContext } from "@app-context/resolve/navigation/header.navigation.resolve.app-context";
import { resolveLinkAppContext } from "@app-context/resolve/shared/links/link.shared.resolve.app-context";

jest.mock(
  "@app-context/resolve/shared/links/link.shared.resolve.app-context",
  () => ({
    resolveLinkAppContext: jest.fn(),
  }),
);

describe("resolveHeaderNavigationAppContext", () => {
  const mockedResolveLinkAppContext = jest.mocked(resolveLinkAppContext);

  const appState = {} as never;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves primary and social navigation links", () => {
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
        svgId: "icon-github",
        behaviour: { openInNewTab: true },
        href: "https://github.com/example",
        text: "GitHub",
      });

    const navigation = {
      primary: [
        {
          kind: "internal",
          id: "about",
          svgId: null,
          behaviour: { openInNewTab: false },
        },
      ],
      social: [
        {
          kind: "social",
          id: "github",
          svgId: "icon-github",
          behaviour: { openInNewTab: true },
        },
      ],
    } as const;

    const result = resolveHeaderNavigationAppContext(navigation, appState);

    expect(result).toEqual({
      primary: [
        {
          kind: "internal",
          id: "about",
          svgId: null,
          behaviour: { openInNewTab: false },
          href: "/about",
          text: "About",
        },
      ],
      social: [
        {
          kind: "social",
          id: "github",
          svgId: "icon-github",
          behaviour: { openInNewTab: true },
          href: "https://github.com/example",
          text: "GitHub",
        },
      ],
    });

    expect(mockedResolveLinkAppContext).toHaveBeenCalledTimes(2);
    expect(mockedResolveLinkAppContext).toHaveBeenNthCalledWith(
      1,
      navigation.primary[0],
      appState,
    );
    expect(mockedResolveLinkAppContext).toHaveBeenNthCalledWith(
      2,
      navigation.social[0],
      appState,
    );
  });

  it("returns empty arrays when primary and social navigation are empty", () => {
    const navigation = {
      primary: [],
      social: [],
    } as const;

    const result = resolveHeaderNavigationAppContext(navigation, appState);

    expect(result).toEqual({
      primary: [],
      social: [],
    });

    expect(mockedResolveLinkAppContext).not.toHaveBeenCalled();
  });
});
