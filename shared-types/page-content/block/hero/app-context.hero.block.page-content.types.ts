// shared-types/page-content/block/hero/app-context.hero.block.page-content.types.ts

import type { AppStateHeroBlockContentModule } from "@shared-types/page-content/block/hero/app-state.hero.block.page-content.types";
import type { AppContextPhotoMetadata } from "@shared-types/media/photo/app-context.photo.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextHeroBlockContentModuleResolvedFields = Readonly<{
  photo: AppContextPhotoMetadata;
}>;

export type AppContextHeroBlockContentModule = Replace<
  AppStateHeroBlockContentModule,
  AppContextHeroBlockContentModuleResolvedFields
>;
