// src/app-render-context/resolve/body-content/block/sequence/sequence.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextSequenceBlock } from "@shared-types/page-content/block/sequence/app-context.sequence.block.types";
import type { AppRenderContextSequenceBlock } from "@shared-types/page-content/block/sequence/app-render-context.sequence.block.types";

import { appRenderContextResolvePhoto } from "@app-render-context/resolve/media/photo.resolve.app-render-context";
import { appRenderContextResolveInline } from "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context";

export const appRenderContextResolveSequenceBlock = (
  appContext: AppContext,
  block: AppContextSequenceBlock,
): AppRenderContextSequenceBlock => {
  return {
    kind: block.kind,
    immersive: block.immersive,
    flow: block.flow,
    caption: block.caption.map((item) =>
      appRenderContextResolveInline(appContext, item),
    ),
    photos: block.photos.map((item) => ({
      position: item.position,
      photo: appRenderContextResolvePhoto(
        item.photo,
        appContext.metadataLabels,
      ),
    })),
  };
};
