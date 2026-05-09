// src/app-render-context/resolve/body-content/block/image-strip.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextImageStripBlock } from "@shared-types/page-content/block/image-strip/app-context.image-strip.block.types";
import type {
  AppRenderContextImageStripBlock,
  AppRenderContextImageStripPhoto,
} from "@shared-types/page-content/block/image-strip/app-render-context.image-strip.block.types";

import { appRenderContextResolvePhoto } from "@app-render-context/resolve/media/photo.resolve.app-render-context";

const appRenderContextResolveImageStripPhoto = (
  appContext: AppContext,
  photo: AppContextImageStripBlock["photos"][number],
): AppRenderContextImageStripPhoto => {
  const resolvedPhoto = appRenderContextResolvePhoto(
    photo,
    appContext.metadataLabels,
  );

  return {
    src: resolvedPhoto.src,
    srcset: resolvedPhoto.srcset,
    sizes: resolvedPhoto.sizes,
    alt: resolvedPhoto.alt,
    width: resolvedPhoto.width,
    height: resolvedPhoto.height,
    ratio: resolvedPhoto.ratio,
  };
};

export const appRenderContextResolveImageStripBlock = (
  appContext: AppContext,
  block: AppContextImageStripBlock,
): AppRenderContextImageStripBlock => ({
  ...block,
  photos: block.photos.map((photo) =>
    appRenderContextResolveImageStripPhoto(appContext, photo),
  ),
});
