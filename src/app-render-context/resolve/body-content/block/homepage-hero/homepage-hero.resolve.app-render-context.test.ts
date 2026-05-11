// src/app-render-context/resolve/body-content/block/homepage-hero/homepage-hero.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextHomepageHeroBlock } from "@shared-types/page-content/block/homepage-hero/app-context.homepage-hero.block.types";

import { appRenderContextResolveHomepageHeroBlock } from "@app-render-context/resolve/body-content/block/homepage-hero/homepage-hero.resolve.app-render-context";
import { appRenderContextResolveInline } from "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context";
import { appRenderContextResolvePhoto } from "@app-render-context/resolve/media/photo.resolve.app-render-context";
import { appRenderContextResolveLink } from "@app-render-context/shared/link.resolve.app-render-context";

jest.mock(
  "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context",
  () => ({
    appRenderContextResolveInline: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/media/photo.resolve.app-render-context",
  () => ({
    appRenderContextResolvePhoto: jest.fn(),
  }),
);

jest.mock("@app-render-context/shared/link.resolve.app-render-context", () => ({
  appRenderContextResolveLink: jest.fn(),
}));

describe("appRenderContextResolveHomepageHeroBlock", () => {
  const mockedAppRenderContextResolveInline = jest.mocked(
    appRenderContextResolveInline,
  );
  const mockedAppRenderContextResolvePhoto = jest.mocked(
    appRenderContextResolvePhoto,
  );
  const mockedAppRenderContextResolveLink = jest.mocked(
    appRenderContextResolveLink,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves homepage hero content, photo, intro, and primary link", () => {
    const metadataLabels = {
      context: "Context",
      settings: "Settings",
    };

    const introItem = {
      kind: "text",
      text: "Nature notes from the edge.",
    };

    const resolvedIntroItem = {
      kind: "text",
      text: "Nature notes from the edge.",
    };

    const photo = {
      id: "coot-hero",
      cloudflareImageId: "raw-cloudflare-id",
      alt: "A coot swimming through soft light.",
    };

    const resolvedPhoto = {
      id: "coot-hero",
      src: "/media/photo/coot-hero",
      srcset: "/media/photo/coot-hero/800 800w",
      sizes: "100vw",
      width: 1600,
      height: 1000,
      ratio: {
        width: 8,
        height: 5,
      },
      alt: "A coot swimming through soft light.",
      title: "Coot Hero",
      meta: [],
    };

    const primaryLink = {
      id: "journal",
      kind: "internal",
      href: "/journal",
      text: "Read the journal",
      svgId: null,
      behaviour: {
        openInNewTab: false,
      },
    };

    const resolvedPrimaryLink = {
      kind: "internal",
      href: "/journal",
      text: "Read the journal",
      openInNewTab: false,
      svg: null,
    };

    mockedAppRenderContextResolveInline.mockReturnValue(
      resolvedIntroItem as never,
    );

    mockedAppRenderContextResolvePhoto.mockReturnValue(
      resolvedPhoto as unknown as ReturnType<
        typeof appRenderContextResolvePhoto
      >,
    );

    mockedAppRenderContextResolveLink.mockReturnValue(
      resolvedPrimaryLink as never,
    );

    const block: AppContextHomepageHeroBlock = {
      kind: "homepageHero",
      flow: "breakout",
      eyebrow: "Portfolio",
      title: "Nature, systems, and field notes",
      intro: [introItem as never],
      photo: photo as never,
      primaryLink: primaryLink as never,
    };

    const appContext = {
      metadataLabels,
    } as unknown as AppContext;

    expect(appRenderContextResolveHomepageHeroBlock(appContext, block)).toEqual(
      {
        kind: "homepageHero",
        flow: "breakout",
        eyebrow: "Portfolio",
        title: "Nature, systems, and field notes",
        intro: [resolvedIntroItem],
        photo: {
          src: resolvedPhoto.src,
          srcset: resolvedPhoto.srcset,
          sizes: resolvedPhoto.sizes,
          alt: resolvedPhoto.alt,
          width: resolvedPhoto.width,
          height: resolvedPhoto.height,
          ratio: resolvedPhoto.ratio,
        },
        primaryLink: resolvedPrimaryLink,
      },
    );

    expect(mockedAppRenderContextResolvePhoto).toHaveBeenCalledWith(
      photo,
      metadataLabels,
    );
    expect(mockedAppRenderContextResolveInline).toHaveBeenCalledWith(
      appContext,
      introItem,
    );
    expect(mockedAppRenderContextResolveLink).toHaveBeenCalledWith(
      appContext,
      primaryLink,
    );
  });

  it("returns null primaryLink when no primary link exists", () => {
    const metadataLabels = {
      context: "Context",
      settings: "Settings",
    };

    const resolvedPhoto = {
      id: "quiet-forest",
      src: "/media/photo/quiet-forest",
      srcset: "/media/photo/quiet-forest/800 800w",
      sizes: "100vw",
      width: 1600,
      height: 1000,
      ratio: {
        width: 8,
        height: 5,
      },
      alt: "A quiet forest path.",
      title: null,
      meta: [],
    };

    mockedAppRenderContextResolvePhoto.mockReturnValue(
      resolvedPhoto as unknown as ReturnType<
        typeof appRenderContextResolvePhoto
      >,
    );

    const block: AppContextHomepageHeroBlock = {
      kind: "homepageHero",
      flow: "breakout",
      eyebrow: "Field notes",
      title: "Quiet observations",
      intro: [],
      photo: { id: "quiet-forest" } as never,
      primaryLink: null,
    };

    const appContext = {
      metadataLabels,
    } as unknown as AppContext;

    expect(appRenderContextResolveHomepageHeroBlock(appContext, block)).toEqual(
      {
        kind: "homepageHero",
        flow: "breakout",
        eyebrow: "Field notes",
        title: "Quiet observations",
        intro: [],
        photo: {
          src: resolvedPhoto.src,
          srcset: resolvedPhoto.srcset,
          sizes: resolvedPhoto.sizes,
          alt: resolvedPhoto.alt,
          width: resolvedPhoto.width,
          height: resolvedPhoto.height,
          ratio: resolvedPhoto.ratio,
        },
        primaryLink: null,
      },
    );

    expect(mockedAppRenderContextResolveInline).not.toHaveBeenCalled();
    expect(mockedAppRenderContextResolveLink).not.toHaveBeenCalled();
  });
});
