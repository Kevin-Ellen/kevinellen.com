// shared-types/page-content/block/image-strip/app-context.image-strip.block.types.ts

import type { AppStateImageStripBlock } from "@shared-types/page-content/block/image-strip/app-state.image-strip.block.types";
import type { AppContextResolvedPhoto } from "@shared-types/media/render-image/app-context.render-image.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type RuntimeFields = Readonly<{
  photos: readonly AppContextResolvedPhoto[];
}>;

export type AppContextImageStripBlock = Replace<
  AppStateImageStripBlock,
  RuntimeFields
>;
