// src/app-render-context/resolve/media/render-image.resolve.app-render-context.ts

import type { AppRenderContextPhoto } from "@shared-types/media/photo/app-render-context.photo.types";

export type AppRenderContextRenderImage = Pick<
  AppRenderContextPhoto,
  "src" | "srcset" | "sizes" | "alt" | "width" | "height" | "ratio"
>;

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
