// src/app-render-context/resolve/body-content/block/image-strip/image-strip.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextImageStripBlock } from "@shared-types/page-content/block/image-strip/app-context.image-strip.block.types";
import type {
  AppRenderContextImageStripBlock,
  AppRenderContextImageStripPhoto,
} from "@shared-types/page-content/block/image-strip/app-render-context.image-strip.block.types";

import { appRenderContextResolvePhoto } from "@app-render-context/resolve/media/photo.resolve.app-render-context";
import { appRenderContextResolveRenderImage } from "@app-render-context/resolve/media/render-image.resolve.app-render-context";

const appRenderContextResolveImageStripPhoto = (
  appContext: AppContext,
  photo: AppContextImageStripBlock["photos"][number],
): AppRenderContextImageStripPhoto =>
  appRenderContextResolveRenderImage(
    appRenderContextResolvePhoto(photo, appContext.metadataLabels),
  );

export const appRenderContextResolveImageStripBlock = (
  appContext: AppContext,
  block: AppContextImageStripBlock,
): AppRenderContextImageStripBlock => ({
  ...block,
  photos: block.photos.map((photo) =>
    appRenderContextResolveImageStripPhoto(appContext, photo),
  ),
});
