// src/app-context/resolve/page-content/block/sequence/sequence.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStateSequenceBlock } from "@shared-types/page-content/block/sequence/app-state.sequence.block.types";
import type { PhotoId } from "@shared-types/media/photo/id.photo.types";

import { appContextResolveSequenceBlock } from "@app-context/resolve/page-content/block/sequence/sequence.resolve.app-context";

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

describe("appContextResolveSequenceBlock", () => {
  it("resolves numbered sequence photos in deterministic order", () => {
    const block: AppStateSequenceBlock = {
      kind: "sequence",
      flow: "content",
      immersive: false,
      caption: [{ kind: "text", value: "A kingfisher exit sequence." }],
      photos: {
        2: "photo-two" as PhotoId,
        1: "photo-one" as PhotoId,
        3: "photo-three" as PhotoId,
      },
    };

    const context = {
      imageDelivery,
      resolvePhoto: jest.fn((photoId: PhotoId) => ({
        id: photoId,
        title: `Resolved ${photoId}`,
      })),
    } as unknown as AppContextPageContentResolverContext;

    expect(appContextResolveSequenceBlock(block, context)).toEqual({
      kind: "sequence",
      flow: "breakout",
      immersive: false,
      caption: [{ kind: "text", value: "A kingfisher exit sequence." }],
      photos: [
        {
          position: 1,
          photo: {
            metadata: {
              id: "photo-one",
              title: "Resolved photo-one",
            },
            delivery: imageDelivery.contentWidth,
          },
        },
        {
          position: 2,
          photo: {
            metadata: {
              id: "photo-two",
              title: "Resolved photo-two",
            },
            delivery: imageDelivery.contentWidth,
          },
        },
        {
          position: 3,
          photo: {
            metadata: {
              id: "photo-three",
              title: "Resolved photo-three",
            },
            delivery: imageDelivery.contentWidth,
          },
        },
      ],
    });
  });

  it("uses full bleed delivery for immersive sequences", () => {
    const block: AppStateSequenceBlock = {
      kind: "sequence",
      flow: "breakout",
      immersive: true,
      caption: [{ kind: "text", value: "An immersive sequence." }],
      photos: {
        1: "photo-one" as PhotoId,
      },
    };

    const context = {
      imageDelivery,
      resolvePhoto: jest.fn((photoId: PhotoId) => ({
        id: photoId,
        title: "Resolved photo",
      })),
    } as unknown as AppContextPageContentResolverContext;

    expect(appContextResolveSequenceBlock(block, context).photos[0]).toEqual({
      position: 1,
      photo: {
        metadata: {
          id: "photo-one",
          title: "Resolved photo",
        },
        delivery: imageDelivery.fullBleed,
      },
    });
  });

  it("throws when a sequence photo is not resolved in context", () => {
    const block: AppStateSequenceBlock = {
      kind: "sequence",
      flow: "content",
      immersive: false,
      caption: [],
      photos: {
        1: "missing-photo" as PhotoId,
      },
    };

    const context = {
      imageDelivery,
      resolvePhoto: jest.fn(() => null),
    } as unknown as AppContextPageContentResolverContext;

    expect(() => appContextResolveSequenceBlock(block, context)).toThrow(
      "No AppContext photo resolved for sequence photoId: missing-photo",
    );

    expect(context.resolvePhoto).toHaveBeenCalledWith("missing-photo");
  });
});
