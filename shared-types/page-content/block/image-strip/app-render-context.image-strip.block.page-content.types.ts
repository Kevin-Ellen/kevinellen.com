// shared-types/page-content/block/image-strip/app-render-context.image-strip.block.page-content.types.ts

import type { AppContextImageStripBlockContentModule } from "@shared-types/page-content/block/image-strip/app-context.image-strip.block.page-content.types";
import type { AppRenderContextPhoto } from "@shared-types/media/photo/app-render-context.photo.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppRenderContextImageStripPhoto = Pick<
  AppRenderContextPhoto,
  "src" | "srcset" | "sizes" | "alt" | "width" | "height" | "ratio"
>;

type AppRenderContextImageStripBlockContentModuleFields = Readonly<{
  photos: readonly AppRenderContextImageStripPhoto[];
}>;

export type AppRenderContextImageStripBlockContentModule = Replace<
  AppContextImageStripBlockContentModule,
  AppRenderContextImageStripBlockContentModuleFields
>;
