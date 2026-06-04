// src/app-context/resolve/page-content/block/sequence/sequence.resolve.app-context.ts

import type { AppStateSequenceBlock } from "@shared-types/page-content/block/sequence/app-state.sequence.block.types";
import type { AppContextSequenceBlock } from "@shared-types/page-content/block/sequence/app-context.sequence.block.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolveInline } from "@app-context/resolve/page-content/inline/inline.resolve.app-context";

export const appContextResolveSequenceBlock = (
  block: AppStateSequenceBlock,
  context: AppContextPageContentResolverContext,
): AppContextSequenceBlock => {
  const photos = Object.entries(block.photos)
    .map(([position, photoId]) => {
      const photo = context.resolvePhoto(photoId);

      if (!photo) {
        throw new Error(
          `No AppContext photo resolved for sequence photoId: ${photoId}`,
        );
      }

      return {
        position: Number(position),
        photo: {
          metadata: photo,
          delivery: block.immersive
            ? context.imageDelivery.fullBleed
            : context.imageDelivery.contentWidth,
        },
      };
    })
    .sort((a, b) => a.position - b.position);

  return {
    kind: block.kind,
    immersive: block.immersive,
    flow: "breakout",
    caption: block.caption.map((item) =>
      appContextResolveInline(item, context),
    ),
    photos,
  };
};
