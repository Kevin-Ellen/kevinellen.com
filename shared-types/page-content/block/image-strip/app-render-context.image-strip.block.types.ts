// shared-types/page-content/block/image-strip/app-render-context.image-strip.block.types.ts

import type { AppContextImageStripBlock } from "@shared-types/page-content/block/image-strip/app-context.image-strip.block.types";
import type { AppRenderContextRenderImage } from "@shared-types/media/render-image/app-render-context.render-image.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppRenderContextImageStripPhoto = AppRenderContextRenderImage;

type ResolvedFields = Readonly<{
  photos: readonly AppRenderContextImageStripPhoto[];
}>;

export type AppRenderContextImageStripBlock = Replace<
  AppContextImageStripBlock,
  ResolvedFields
>;
