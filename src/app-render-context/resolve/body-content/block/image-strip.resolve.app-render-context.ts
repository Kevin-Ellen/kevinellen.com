// src/app-render-context/resolve/body-content/block/image-strip.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextImageStripBlockContentModule } from "@shared-types/page-content/block/image-strip/app-context.image-strip.block.page-content.types";
import type {
  AppRenderContextImageStripBlockContentModule,
  AppRenderContextImageStripPhoto,
} from "@shared-types/page-content/block/image-strip/app-render-context.image-strip.block.page-content.types";

import { resolvePhotoAppRenderContext } from "@app-render-context/resolve/media/photo.resolve.app-render-context";

const resolveImageStripPhotoAppRenderContext = (
  appContext: AppContext,
  photo: AppContextImageStripBlockContentModule["photos"][number],
): AppRenderContextImageStripPhoto => {
  const resolvedPhoto = resolvePhotoAppRenderContext(
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

export const resolveImageStripBlockContentModuleAppRenderContext = (
  appContext: AppContext,
  module: AppContextImageStripBlockContentModule,
): AppRenderContextImageStripBlockContentModule => {
  return {
    ...module,
    photos: module.photos.map((photo) =>
      resolveImageStripPhotoAppRenderContext(appContext, photo),
    ),
  };
};
