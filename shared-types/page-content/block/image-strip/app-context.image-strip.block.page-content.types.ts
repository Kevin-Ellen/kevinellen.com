// shared-types/page-content/block/image-strip/app-context.image-strip.block.page-content.types.ts

import type { AppStateImageStripBlockContentModule } from "@shared-types/page-content/block/image-strip/app-state.image-strip.block.page-content.types";
import type { AppContextPhotoMetadata } from "@shared-types/media/photo/app-context.photo.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextImageStripBlockContentModuleFields = Readonly<{
  photos: readonly AppContextPhotoMetadata[];
}>;

export type AppContextImageStripBlockContentModule = Replace<
  AppStateImageStripBlockContentModule,
  AppContextImageStripBlockContentModuleFields
>;
