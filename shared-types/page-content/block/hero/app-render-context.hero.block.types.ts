// shared-types/page-content/block/hero/app-render-context.hero.block.types.ts

import type { AppContextHeroBlock } from "@shared-types/page-content/block/hero/app-context.hero.block.types";
import type { AppRenderContextPhoto } from "@shared-types/media/photo/app-render-context.photo.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type ReplacementFields = Readonly<{
  photo: AppRenderContextPhoto;
}>;

export type AppRenderContextHeroBlock = Replace<
  AppContextHeroBlock,
  ReplacementFields
>;
