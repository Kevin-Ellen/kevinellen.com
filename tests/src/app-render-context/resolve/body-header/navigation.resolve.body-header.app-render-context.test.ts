// tests/src/app-render-context/resolve/body-header/navigation.resolve.body-header.app-render-context.test.ts

import { resolveNavigationBodyHeaderAppRenderContext } from "@app-render-context/resolve/body-header/navigation.resolve.body-header.app-render-context";
import { resolveLinkAppRenderContext } from "@app-render-context/shared/link.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

jest.mock("@app-render-context/shared/link.resolve.app-render-context", () => ({
  resolveLinkAppRenderContext: jest.fn(),
}));

describe("resolveNavigationBodyHeaderAppRenderContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves primary and social navigation links", () => {
    const primaryLink = {
      kind: "internal",
      id: "about",
      href: "/about",
      text: "About",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    const socialLink = {
      kind: "social",
      id: "github",
      href: "https://github.com/Kevin-Ellen",
      text: "GitHub",
      svgId: "icon-home",
      behaviour: {
        openInNewTab: true,
      },
    };

    const appContext = {
      canonicalUrl: "https://dev.kevinellen.com/about",
      navigation: {
        header: {
          primary: [primaryLink],
          social: [socialLink],
        },
      },
    } as unknown as AppContext;

    const resolvedPrimaryLink = {
      kind: "internal",
      href: "/about",
      text: "About",
      openInNewTab: false,
      svg: null,
    } as const;

    const resolvedSocialLink = {
      kind: "social",
      href: "https://github.com/Kevin-Ellen",
      text: "GitHub",
      openInNewTab: true,
      svg: {
        id: "icon-home",
        width: 100,
        height: 100,
      },
    } as const;

    jest
      .mocked(resolveLinkAppRenderContext)
      .mockReturnValueOnce(resolvedPrimaryLink)
      .mockReturnValueOnce(resolvedSocialLink);

    const result = resolveNavigationBodyHeaderAppRenderContext(appContext);

    expect(resolveLinkAppRenderContext).toHaveBeenNthCalledWith(
      1,
      appContext,
      primaryLink,
    );
    expect(resolveLinkAppRenderContext).toHaveBeenNthCalledWith(
      2,
      appContext,
      socialLink,
    );

    expect(result).toEqual({
      primary: [
        {
          ...resolvedPrimaryLink,
          ariaCurrent: "page",
        },
      ],
      social: [
        {
          ...resolvedSocialLink,
          ariaCurrent: null,
        },
      ],
    });
  });

  it("sets ariaCurrent to null when the primary link does not match the current path", () => {
    const primaryLink = {
      kind: "internal",
      id: "about",
      href: "/about",
      text: "About",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    const appContext = {
      canonicalUrl: "https://dev.kevinellen.com/contact",
      navigation: {
        header: {
          primary: [primaryLink],
          social: [],
        },
      },
    } as unknown as AppContext;

    const resolvedPrimaryLink = {
      kind: "internal",
      href: "/about",
      text: "About",
      openInNewTab: false,
      svg: null,
    } as const;

    jest
      .mocked(resolveLinkAppRenderContext)
      .mockReturnValue(resolvedPrimaryLink);

    const result = resolveNavigationBodyHeaderAppRenderContext(appContext);

    expect(result.primary).toEqual([
      {
        ...resolvedPrimaryLink,
        ariaCurrent: null,
      },
    ]);
  });

  it("sets ariaCurrent to null when canonicalUrl is null", () => {
    const primaryLink = {
      kind: "internal",
      id: "about",
      href: "/about",
      text: "About",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    const appContext = {
      canonicalUrl: null,
      navigation: {
        header: {
          primary: [primaryLink],
          social: [],
        },
      },
    } as unknown as AppContext;

    const resolvedPrimaryLink = {
      kind: "internal",
      href: "/about",
      text: "About",
      openInNewTab: false,
      svg: null,
    } as const;

    jest
      .mocked(resolveLinkAppRenderContext)
      .mockReturnValue(resolvedPrimaryLink);

    const result = resolveNavigationBodyHeaderAppRenderContext(appContext);

    expect(result.primary).toEqual([
      {
        ...resolvedPrimaryLink,
        ariaCurrent: null,
      },
    ]);
  });
});
