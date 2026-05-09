// src/app-render-context/resolve/body-content/block/image-strip.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextImageStripBlock } from "@shared-types/page-content/block/image-strip/app-context.image-strip.block.types";

import { appRenderContextResolveImageStripBlock } from "@app-render-context/resolve/body-content/block/image-strip.resolve.app-render-context";
import { appRenderContextResolvePhoto } from "@app-render-context/resolve/media/photo.resolve.app-render-context";

jest.mock(
  "@app-render-context/resolve/media/photo.resolve.app-render-context",
  () => ({
    appRenderContextResolvePhoto: jest.fn(),
  }),
);

const createAppContext = (): AppContext =>
  ({
    metadataLabels: {
      context: "Context",
      settings: "Settings",
    },
  }) as unknown as AppContext;

const createImageStripBlock = (
  overrides: Partial<AppContextImageStripBlock> = {},
): AppContextImageStripBlock => ({
  kind: "imageStrip",
  flow: "breakout",
  heading: {
    text: "Featured photography",
    visuallyHidden: false,
    level: 2,
  },
  source: "homepage-strip",
  strategy: "dailyRandom",
  itemCount: 6,
  excludePagePhotos: true,
  photos: [],
  ...overrides,
});

describe("appRenderContextResolveImageStripBlock", () => {
  const mockedAppRenderContextResolvePhoto = jest.mocked(
    appRenderContextResolvePhoto,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves and trims image strip photos", () => {
    const sourcePhoto = {
      id: "coot-strip",
      cloudflareImageId: "raw-cloudflare-id",
      alt: "A coot in soft water.",
    };

    const resolvedPhoto = {
      id: "coot-strip",
      src: "/media/photo/coot-strip",
      srcset: "/media/photo/coot-strip/800 800w",
      sizes: "100vw",
      width: 1600,
      height: 1000,
      ratio: "16 / 10",
      alt: "A coot in soft water.",
      title: "Coot Strip",
      caption: "A coot in soft water.",
      metadata: [],
    };

    mockedAppRenderContextResolvePhoto.mockReturnValue(
      resolvedPhoto as unknown as ReturnType<
        typeof appRenderContextResolvePhoto
      >,
    );

    const block = createImageStripBlock({
      photos: [sourcePhoto as never],
    });

    const result = appRenderContextResolveImageStripBlock(
      createAppContext(),
      block,
    );

    expect(result).toEqual({
      ...block,
      photos: [
        {
          src: resolvedPhoto.src,
          srcset: resolvedPhoto.srcset,
          sizes: resolvedPhoto.sizes,
          alt: resolvedPhoto.alt,
          width: resolvedPhoto.width,
          height: resolvedPhoto.height,
          ratio: resolvedPhoto.ratio,
        },
      ],
    });

    expect(mockedAppRenderContextResolvePhoto).toHaveBeenCalledTimes(1);
    expect(mockedAppRenderContextResolvePhoto).toHaveBeenCalledWith(
      sourcePhoto,
      {
        context: "Context",
        settings: "Settings",
      },
    );
  });

  it("returns an empty photos array when no photos exist", () => {
    const block = createImageStripBlock({
      itemCount: 0,
      photos: [],
    });

    expect(
      appRenderContextResolveImageStripBlock(createAppContext(), block),
    ).toEqual({
      ...block,
      photos: [],
    });

    expect(mockedAppRenderContextResolvePhoto).not.toHaveBeenCalled();
  });

  it("resolves each image strip photo independently", () => {
    const photoOne = { id: "photo-one" };
    const photoTwo = { id: "photo-two" };

    mockedAppRenderContextResolvePhoto
      .mockReturnValueOnce({
        src: "/media/photo/photo-one",
        srcset: "/media/photo/photo-one/800 800w",
        sizes: "100vw",
        alt: "Photo one.",
        width: 1600,
        height: 1000,
        ratio: "16 / 10",
      } as unknown as ReturnType<typeof appRenderContextResolvePhoto>)
      .mockReturnValueOnce({
        src: "/media/photo/photo-two",
        srcset: "/media/photo/photo-two/800 800w",
        sizes: "100vw",
        alt: "Photo two.",
        width: 1200,
        height: 800,
        ratio: "3 / 2",
      } as unknown as ReturnType<typeof appRenderContextResolvePhoto>);

    const block = createImageStripBlock({
      itemCount: 2,
      photos: [photoOne as never, photoTwo as never],
    });

    expect(
      appRenderContextResolveImageStripBlock(createAppContext(), block),
    ).toEqual({
      ...block,
      photos: [
        {
          src: "/media/photo/photo-one",
          srcset: "/media/photo/photo-one/800 800w",
          sizes: "100vw",
          alt: "Photo one.",
          width: 1600,
          height: 1000,
          ratio: "16 / 10",
        },
        {
          src: "/media/photo/photo-two",
          srcset: "/media/photo/photo-two/800 800w",
          sizes: "100vw",
          alt: "Photo two.",
          width: 1200,
          height: 800,
          ratio: "3 / 2",
        },
      ],
    });

    expect(mockedAppRenderContextResolvePhoto).toHaveBeenCalledTimes(2);
    expect(mockedAppRenderContextResolvePhoto).toHaveBeenNthCalledWith(
      1,
      photoOne,
      {
        context: "Context",
        settings: "Settings",
      },
    );
    expect(mockedAppRenderContextResolvePhoto).toHaveBeenNthCalledWith(
      2,
      photoTwo,
      {
        context: "Context",
        settings: "Settings",
      },
    );
  });
});
