// shared-types/page-content/block/hero/app-context.hero.block.types.ts

import type { AppStateHeroBlock } from "@shared-types/page-content/block/hero/app-state.hero.block.types";
import type { AppContextResolvedPhoto } from "@shared-types/media/render-image/app-context.render-image.types";

import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

type ResolvedFields = Readonly<{
  photo: AppContextResolvedPhoto;
}>;

export type AppContextHeroBlock = ReplaceAndOmit<
  AppStateHeroBlock,
  ResolvedFields,
  "photoId"
>;
