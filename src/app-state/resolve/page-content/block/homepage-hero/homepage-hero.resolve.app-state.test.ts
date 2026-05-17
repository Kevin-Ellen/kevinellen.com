// src/app-state/resolve/page-content/block/homepage-hero/homepage-hero.resolve.app-state.test.ts

import { appStateResolveHomepageHeroBlock } from "@app-state/resolve/page-content/block/homepage-hero/homepage-hero.resolve.app-state";

import { appStateResolveInline } from "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state";
import { appStateResolveInternalLink } from "@app-state/resolve/links/internal.link.resolve.app-state";

jest.mock(
  "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state",
  () => ({
    appStateResolveInline: jest.fn(),
  }),
);

jest.mock("@app-state/resolve/links/internal.link.resolve.app-state", () => ({
  appStateResolveInternalLink: jest.fn(),
}));

describe("appStateResolveHomepageHeroBlock", () => {
  const mockedAppStateResolveInline = jest.mocked(appStateResolveInline);

  const mockedAppStateResolveInternalLink = jest.mocked(
    appStateResolveInternalLink,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("applies deterministic defaults", () => {
    expect(
      appStateResolveHomepageHeroBlock({
        kind: "homepageHero",
        title: "Homepage Hero",
        photoId: "hero-photo",
      } as never),
    ).toEqual({
      kind: "homepageHero",
      flow: "breakout",
      eyebrow: null,
      title: "Homepage Hero",
      intro: [],
      photoId: "hero-photo",
      primaryLink: null,
    });
  });

  it("resolves intro inline content and primary link", () => {
    const intro = [
      {
        kind: "text",
        value: "Hello world",
      },
    ];

    const resolvedInline = {
      kind: "text",
      value: "Resolved",
    };

    const primaryLink = {
      kind: "internal",
      id: "journal",
    };

    const resolvedPrimaryLink = {
      kind: "internal",
      id: "journal",
      text: null,
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    mockedAppStateResolveInline.mockReturnValue(resolvedInline as never);

    mockedAppStateResolveInternalLink.mockReturnValue(
      resolvedPrimaryLink as never,
    );

    expect(
      appStateResolveHomepageHeroBlock({
        kind: "homepageHero",
        eyebrow: "Field Notes",
        title: "Homepage Hero",
        intro,
        photoId: "hero-photo",
        primaryLink,
      } as never),
    ).toEqual({
      kind: "homepageHero",
      flow: "breakout",
      eyebrow: "Field Notes",
      title: "Homepage Hero",
      intro: [resolvedInline],
      photoId: "hero-photo",
      primaryLink: resolvedPrimaryLink,
    });

    expect(mockedAppStateResolveInline).toHaveBeenCalledWith(
      intro[0],
      0,
      intro,
    );

    expect(mockedAppStateResolveInternalLink).toHaveBeenCalledWith(primaryLink);
  });
});
