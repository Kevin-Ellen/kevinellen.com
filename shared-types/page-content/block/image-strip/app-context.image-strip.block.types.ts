// shared-types/page-content/block/image-strip/app-context.image-strip.block.types.ts

import type { AppStateImageStripBlock } from "@shared-types/page-content/block/image-strip/app-state.image-strip.block.types";
import type { AppContextPhotoMetadata } from "@shared-types/media/photo/app-context.photo.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type ResolvedFields = Readonly<{
  photos: readonly AppContextPhotoMetadata[];
}>;

export type AppContextImageStripBlock = Replace<
  AppStateImageStripBlock,
  ResolvedFields
>;
