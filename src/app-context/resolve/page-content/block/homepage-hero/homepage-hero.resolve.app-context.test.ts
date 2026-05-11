// src/app-context/resolve/page-content/block/homepage-hero/homepage-hero.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStateHomepageHeroBlock } from "@shared-types/page-content/block/homepage-hero/app-state.homepage-hero.block.types";
import type { AppStateInternalLink } from "@shared-types/links/app-state.links.types";

import { appContextResolveHomepageHero } from "@app-context/resolve/page-content/block/homepage-hero/homepage-hero.resolve.app-context";

import { appContextResolveInline } from "@app-context/resolve/page-content/inline/inline.resolve.app-context";

jest.mock(
  "@app-context/resolve/page-content/inline/inline.resolve.app-context",
  () => ({
    appContextResolveInline: jest.fn(),
  }),
);

describe("appContextResolveHomepageHero", () => {
  const mockedAppContextResolveInline = jest.mocked(appContextResolveInline);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves homepage hero content, photo, intro, and primary link", () => {
    const photo = {
      id: "coot",
      title: "Coot",
    };

    const primaryLink: AppStateInternalLink = {
      kind: "internal",
      id: "journal",
      text: null,
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    const resolvedPrimaryLink = {
      kind: "internal",
      id: "journal",
      href: "/journal",
      text: "Journal",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    const context = {
      photos: [photo],
      resolveInternalLink: jest.fn().mockReturnValue(resolvedPrimaryLink),
    } as unknown as AppContextPageContentResolverContext;

    const block: AppStateHomepageHeroBlock = {
      kind: "homepageHero",
      flow: "breakout",
      eyebrow: "Photography Duck",
      title: "Field notes from the edge",
      intro: [
        {
          kind: "text",
          value: "Hello",
        },
      ],
      photoId: "coot",
      primaryLink,
    };

    mockedAppContextResolveInline.mockReturnValue({
      kind: "text",
      value: "Hello",
    });

    const result = appContextResolveHomepageHero(block, context);

    expect(result).toEqual({
      kind: "homepageHero",
      flow: "breakout",
      eyebrow: "Photography Duck",
      title: "Field notes from the edge",
      intro: [
        {
          kind: "text",
          value: "Hello",
        },
      ],
      photo,
      primaryLink: resolvedPrimaryLink,
    });

    expect(mockedAppContextResolveInline).toHaveBeenCalledTimes(1);
    expect(mockedAppContextResolveInline).toHaveBeenCalledWith(
      block.intro[0],
      context,
    );

    expect(context.resolveInternalLink).toHaveBeenCalledTimes(1);
    expect(context.resolveInternalLink).toHaveBeenCalledWith(primaryLink);
  });

  it("uses null primaryLink when no primary link exists", () => {
    const photo = {
      id: "coot",
      title: "Coot",
    };

    const context = {
      photos: [photo],
      resolveInternalLink: jest.fn(),
    } as unknown as AppContextPageContentResolverContext;

    const block: AppStateHomepageHeroBlock = {
      kind: "homepageHero",
      flow: "breakout",
      eyebrow: null,
      title: "Field notes from the edge",
      intro: [],
      photoId: "coot",
      primaryLink: null,
    };

    const result = appContextResolveHomepageHero(block, context);

    expect(result).toEqual({
      kind: "homepageHero",
      flow: "breakout",
      eyebrow: null,
      title: "Field notes from the edge",
      intro: [],
      photo,
      primaryLink: null,
    });

    expect(mockedAppContextResolveInline).not.toHaveBeenCalled();
    expect(context.resolveInternalLink).not.toHaveBeenCalled();
  });

  it("throws when the homepage hero photo is not resolved in context", () => {
    const context = {
      photos: [],
      resolveInternalLink: jest.fn(),
    } as unknown as AppContextPageContentResolverContext;

    const block: AppStateHomepageHeroBlock = {
      kind: "homepageHero",
      flow: "breakout",
      eyebrow: null,
      title: "Field notes from the edge",
      intro: [],
      photoId: "missing-photo",
      primaryLink: null,
    };

    expect(() => appContextResolveHomepageHero(block, context)).toThrow(
      "No AppContext photo resolved for homepage hero photoId: missing-photo",
    );
  });
});
