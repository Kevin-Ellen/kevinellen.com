// src/app-render-context/resolve/body-header/navigation.body-header.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";

import { appRenderContextResolveBodyHeaderNavigation } from "@app-render-context/resolve/body-header/navigation.body-header.resolve.app-render-context";
import { appRenderContextResolveLink } from "@app-render-context/shared/link.resolve.app-render-context";

jest.mock("@app-render-context/shared/link.resolve.app-render-context", () => ({
  appRenderContextResolveLink: jest.fn(),
}));

describe("appRenderContextResolveBodyHeaderNavigation", () => {
  const mockedAppRenderContextResolveLink = jest.mocked(
    appRenderContextResolveLink,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves primary navigation and marks the current page", () => {
    const journalLink = {
      id: "journal",
      kind: "internal",
      href: "/journal",
      text: "Journal",
      svgId: null,
      behaviour: { openInNewTab: false },
    };

    const articlesLink = {
      id: "articles",
      kind: "internal",
      href: "/articles",
      text: "Articles",
      svgId: null,
      behaviour: { openInNewTab: false },
    };

    mockedAppRenderContextResolveLink
      .mockReturnValueOnce({
        kind: "internal",
        href: "/journal",
        text: "Journal",
        openInNewTab: false,
        svg: null,
      } as never)
      .mockReturnValueOnce({
        kind: "internal",
        href: "/articles",
        text: "Articles",
        openInNewTab: false,
        svg: null,
      } as never);

    const appContext = {
      canonicalUrl: "https://kevinellen.com/journal",
      navigation: {
        header: {
          primary: [journalLink, articlesLink],
          social: [],
        },
      },
    } as unknown as AppContext;

    expect(appRenderContextResolveBodyHeaderNavigation(appContext)).toEqual({
      primary: [
        {
          kind: "internal",
          href: "/journal",
          text: "Journal",
          openInNewTab: false,
          svg: null,
          ariaCurrent: "page",
        },
        {
          kind: "internal",
          href: "/articles",
          text: "Articles",
          openInNewTab: false,
          svg: null,
          ariaCurrent: null,
        },
      ],
      social: [],
    });

    expect(mockedAppRenderContextResolveLink).toHaveBeenNthCalledWith(
      1,
      appContext,
      journalLink,
    );
    expect(mockedAppRenderContextResolveLink).toHaveBeenNthCalledWith(
      2,
      appContext,
      articlesLink,
    );
  });

  it("resolves social navigation with null ariaCurrent", () => {
    const githubLink = {
      id: "github",
      kind: "external",
      href: "https://github.com/Kevin-Ellen",
      text: "GitHub",
      svgId: null,
      behaviour: { openInNewTab: true },
    };

    mockedAppRenderContextResolveLink.mockReturnValue({
      kind: "external",
      href: "https://github.com/Kevin-Ellen",
      text: "GitHub",
      openInNewTab: true,
      svg: null,
    } as never);

    const appContext = {
      canonicalUrl: "https://kevinellen.com/",
      navigation: {
        header: {
          primary: [],
          social: [githubLink],
        },
      },
    } as unknown as AppContext;

    expect(appRenderContextResolveBodyHeaderNavigation(appContext)).toEqual({
      primary: [],
      social: [
        {
          kind: "external",
          href: "https://github.com/Kevin-Ellen",
          text: "GitHub",
          openInNewTab: true,
          svg: null,
          ariaCurrent: null,
        },
      ],
    });

    expect(mockedAppRenderContextResolveLink).toHaveBeenCalledWith(
      appContext,
      githubLink,
    );
  });

  it("does not mark a primary item current when canonicalUrl is null", () => {
    const journalLink = {
      id: "journal",
      kind: "internal",
      href: "/journal",
      text: "Journal",
      svgId: null,
      behaviour: { openInNewTab: false },
    };

    mockedAppRenderContextResolveLink.mockReturnValue({
      kind: "internal",
      href: "/journal",
      text: "Journal",
      openInNewTab: false,
      svg: null,
    } as never);

    const appContext = {
      canonicalUrl: null,
      navigation: {
        header: {
          primary: [journalLink],
          social: [],
        },
      },
    } as unknown as AppContext;

    expect(appRenderContextResolveBodyHeaderNavigation(appContext)).toEqual({
      primary: [
        {
          kind: "internal",
          href: "/journal",
          text: "Journal",
          openInNewTab: false,
          svg: null,
          ariaCurrent: null,
        },
      ],
      social: [],
    });
  });
});
