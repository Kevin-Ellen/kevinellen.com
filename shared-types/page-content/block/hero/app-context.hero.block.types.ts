// shared-types/page-content/block/hero/app-context.hero.block.types.ts

import type { AppStateHeroBlock } from "@shared-types/page-content/block/hero/app-state.hero.block.types";
import type { AppContextPhotoMetadata } from "@shared-types/media/photo/app-context.photo.types";

import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

type ResolvedFields = Readonly<{
  photo: AppContextPhotoMetadata;
}>;

export type AppContextHeroBlock = ReplaceAndOmit<
  AppStateHeroBlock,
  ResolvedFields,
  "photoId"
>;
