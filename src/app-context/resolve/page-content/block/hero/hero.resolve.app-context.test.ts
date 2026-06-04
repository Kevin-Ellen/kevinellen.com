// src/app-context/resolve/page-content/block/hero/hero.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStateHeroBlock } from "@shared-types/page-content/block/hero/app-state.hero.block.types";
import type { PhotoId } from "@shared-types/media/photo/id.photo.types";

import { appContextResolveHeroBlock } from "@app-context/resolve/page-content/block/hero/hero.resolve.app-context";

const imageDelivery = {
  fullBleed: {
    sizes: "100vw",
    widths: [960, 1280, 1600, 1920],
  },
  contentWidth: {
    sizes: "(min-width: 1200px) 960px, calc(100vw - 2rem)",
    widths: [640, 960, 1280, 1600],
  },
} as const;

describe("appContextResolveHeroBlock", () => {
  it("resolves the immersive hero photo with full bleed delivery", () => {
    const block: AppStateHeroBlock = {
      kind: "hero",
      flow: "breakout",
      immersive: true,
      photoId: "coot" as PhotoId,
    };

    const photo = {
      id: "coot",
      title: "Coot",
    };

    const context = {
      imageDelivery,
      resolvePhoto: jest.fn((photoId: PhotoId) => {
        if (photoId === ("coot" as PhotoId)) return photo;

        return null;
      }),
    } as unknown as AppContextPageContentResolverContext;

    const result = appContextResolveHeroBlock(block, context);

    expect(result).toEqual({
      kind: "hero",
      immersive: true,
      flow: "breakout",
      photo: {
        metadata: photo,
        delivery: imageDelivery.fullBleed,
      },
    });
  });

  it("resolves the non-immersive hero photo with content-width delivery", () => {
    const block: AppStateHeroBlock = {
      kind: "hero",
      flow: "content",
      immersive: false,
      photoId: "coot" as PhotoId,
    };

    const photo = {
      id: "coot",
      title: "Coot",
    };

    const context = {
      imageDelivery,
      resolvePhoto: jest.fn((photoId: PhotoId) => {
        if (photoId === ("coot" as PhotoId)) return photo;

        return null;
      }),
    } as unknown as AppContextPageContentResolverContext;

    const result = appContextResolveHeroBlock(block, context);

    expect(result).toEqual({
      kind: "hero",
      immersive: false,
      flow: "breakout",
      photo: {
        metadata: photo,
        delivery: imageDelivery.contentWidth,
      },
    });
  });

  it("throws when the hero photo is not resolved in context", () => {
    const block: AppStateHeroBlock = {
      kind: "hero",
      photoId: "missing-photo",
      immersive: false,
      flow: "breakout",
    };

    const context = {
      imageDelivery,
      resolvePhoto: jest.fn(() => null),
    } as unknown as AppContextPageContentResolverContext;

    expect(() => appContextResolveHeroBlock(block, context)).toThrow(
      "No AppContext photo resolved for hero photoId: missing-photo",
    );

    expect(context.resolvePhoto).toHaveBeenCalledWith("missing-photo");
  });
});
