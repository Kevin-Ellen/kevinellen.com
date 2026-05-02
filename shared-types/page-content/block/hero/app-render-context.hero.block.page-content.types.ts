// shared-types/page-content/block/hero/app-render-context.hero.block.page-content.types.ts

import type { AppContextHeroBlockContentModule } from "@shared-types/page-content/block/hero/app-context.hero.block.page-content.types";
import type { AppRenderContextPhoto } from "@shared-types/media/photo/app-render-context.photo.types";

import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

type AppRenderContextHeroBlockContentModuleReplacementFields = Readonly<{
  photo: AppRenderContextPhoto;
}>;

export type AppRenderContextHeroBlockContentModule = ReplaceAndOmit<
  AppContextHeroBlockContentModule,
  AppRenderContextHeroBlockContentModuleReplacementFields,
  "photoId"
>;
