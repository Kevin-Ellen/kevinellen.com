// src/app-context/resolve/page-content/block/image-strip/image-strip.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStateImageStripBlock } from "@shared-types/page-content/block/image-strip/app-state.image-strip.block.types";

import { appContextResolveImageStripBlock } from "@app-context/resolve/page-content/block/image-strip/image-strip.resolve.app-context";

const imageDelivery = {
  homepageImageStrip: {
    sizes: "(min-width: 1200px) 310px, (min-width: 768px) 33vw, 85vw",
    widths: [320, 480, 640, 960],
  },
} as const;

const createModule = (itemCount: number): AppStateImageStripBlock => ({
  kind: "imageStrip",
  source: "homepage-strip",
  heading: {
    text: "Featured photographs",
    level: 2,
    visuallyHidden: true,
  },
  strategy: "dailyRandom",
  itemCount,
  excludePagePhotos: false,
  flow: "content",
});

describe("appContextResolveImageStripBlock", () => {
  it("resolves image strip photos", () => {
    const photoOne = {
      id: "coot",
      title: "Coot",
    };

    const photoTwo = {
      id: "heron",
      title: "Heron",
    };

    const context = {
      imageDelivery,
      homepageStripPhotoIds: ["coot", "heron"],
      resolvePhoto: jest.fn((photoId: string) => {
        if (photoId === "coot") return photoOne;
        if (photoId === "heron") return photoTwo;

        return null;
      }),
    } as unknown as AppContextPageContentResolverContext;

    const module = createModule(2);

    const result = appContextResolveImageStripBlock(module, context);

    expect(result).toEqual({
      ...module,
      photos: expect.arrayContaining([
        {
          metadata: photoOne,
          delivery: imageDelivery.homepageImageStrip,
        },
        {
          metadata: photoTwo,
          delivery: imageDelivery.homepageImageStrip,
        },
      ]),
    });

    expect(result.photos).toHaveLength(2);
    expect(context.resolvePhoto).toHaveBeenCalledTimes(2);
  });

  it("limits photos to the configured item count", () => {
    const context = {
      imageDelivery,
      homepageStripPhotoIds: ["one", "two", "three"],
      resolvePhoto: jest.fn((photoId: string) => ({
        id: photoId,
      })),
    } as unknown as AppContextPageContentResolverContext;

    const module = createModule(1);

    const result = appContextResolveImageStripBlock(module, context);

    expect(result).toEqual({
      ...module,
      photos: [
        {
          metadata: {
            id: expect.any(String),
          },
          delivery: imageDelivery.homepageImageStrip,
        },
      ],
    });

    expect(context.resolvePhoto).toHaveBeenCalledTimes(1);
  });

  it("throws when a selected photo cannot be resolved", () => {
    const context = {
      imageDelivery,
      homepageStripPhotoIds: ["missing-photo"],
      resolvePhoto: jest.fn(() => null),
    } as unknown as AppContextPageContentResolverContext;

    const module = createModule(1);

    expect(() => appContextResolveImageStripBlock(module, context)).toThrow(
      "No AppContext photo resolved for imageStrip photoId: missing-photo",
    );

    expect(context.resolvePhoto).toHaveBeenCalledTimes(1);
    expect(context.resolvePhoto).toHaveBeenCalledWith("missing-photo");
  });
});
