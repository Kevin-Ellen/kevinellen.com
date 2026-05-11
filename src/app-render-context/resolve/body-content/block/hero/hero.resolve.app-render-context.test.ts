// src/app-render-context/resolve/body-content/block/hero/hero.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextHeroBlock } from "@shared-types/page-content/block/hero/app-context.hero.block.types";

import { appRenderContextResolvePhoto } from "@app-render-context/resolve/media/photo.resolve.app-render-context";
import { appRenderContextResolveHeroBlock } from "@app-render-context/resolve/body-content/block/hero/hero.resolve.app-render-context";

jest.mock(
  "@app-render-context/resolve/media/photo.resolve.app-render-context",
  () => ({
    appRenderContextResolvePhoto: jest.fn(),
  }),
);

describe("appRenderContextResolveHeroBlock", () => {
  const mockedAppRenderContextResolvePhoto = jest.mocked(
    appRenderContextResolvePhoto,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves a hero block with a render-safe photo", () => {
    const metadataLabels = {
      context: "Context",
      settings: "Settings",
    };

    const photo = {
      id: "coot-at-sunset",
      cloudflareImageId: "raw-cloudflare-id",
      alt: "A coot at sunset.",
    };

    const resolvedPhoto = {
      id: "coot-at-sunset",
      src: "/media/photo/coot-at-sunset",
      srcset: "/media/photo/coot-at-sunset/800 800w",
      sizes: "100vw",
      width: 1600,
      height: 1000,
      ratio: "16 / 10",
      alt: "A coot at sunset.",
      title: null,
      caption: null,
      metadata: [],
    };

    mockedAppRenderContextResolvePhoto.mockReturnValue(
      resolvedPhoto as unknown as ReturnType<
        typeof appRenderContextResolvePhoto
      >,
    );

    const block: AppContextHeroBlock = {
      kind: "hero",
      immersive: true,
      flow: "breakout",
      photo: photo as never,
    };

    const appContext = {
      metadataLabels,
    } as unknown as AppContext;

    const result = appRenderContextResolveHeroBlock(appContext, block);

    expect(result).toEqual({
      kind: "hero",
      immersive: true,
      flow: "breakout",
      photo: resolvedPhoto,
    });

    expect(mockedAppRenderContextResolvePhoto).toHaveBeenCalledTimes(1);
    expect(mockedAppRenderContextResolvePhoto).toHaveBeenCalledWith(
      photo,
      metadataLabels,
    );
  });

  it("preserves non-immersive content-flow hero configuration", () => {
    const metadataLabels = {
      context: "Context",
      settings: "Settings",
    };

    const photo = {
      id: "mallorca-ibis",
      cloudflareImageId: "raw-cloudflare-id",
      alt: "A glossy ibis in flight.",
    };

    const resolvedPhoto = {
      id: "mallorca-ibis",
      src: "/media/photo/mallorca-ibis",
      srcset: "/media/photo/mallorca-ibis/800 800w",
      sizes: "100vw",
      width: 1600,
      height: 1000,
      ratio: "16 / 10",
      alt: "A glossy ibis in flight.",
      title: null,
      caption: null,
      metadata: [],
    };

    mockedAppRenderContextResolvePhoto.mockReturnValue(
      resolvedPhoto as unknown as ReturnType<
        typeof appRenderContextResolvePhoto
      >,
    );

    const block: AppContextHeroBlock = {
      kind: "hero",
      immersive: false,
      flow: "content",
      photo: photo as never,
    };

    const appContext = {
      metadataLabels,
    } as unknown as AppContext;

    expect(appRenderContextResolveHeroBlock(appContext, block)).toEqual({
      kind: "hero",
      immersive: false,
      flow: "content",
      photo: resolvedPhoto,
    });
  });
});
