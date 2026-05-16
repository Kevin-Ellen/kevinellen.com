// src/app-render-context/resolve/media/render-image.resolve.app-render-context.ts

import type { AppRenderContextPhoto } from "@shared-types/media/photo/app-render-context.render-photo.types";
import type { AppRenderContextRenderImage } from "@shared-types/media/render-image/app-render-context.render-image.types";

export const appRenderContextResolveRenderImage = (
  photo: AppRenderContextPhoto,
): AppRenderContextRenderImage => ({
  src: photo.src,
  srcset: photo.srcset,
  sizes: photo.sizes,
  alt: photo.alt,
  width: photo.width,
  height: photo.height,
  ratio: photo.ratio,
});
