// shared-types/page-content/block/hero/authored.hero.block.page-content.types.ts

import type { PhotoId } from "@shared-types/media/photo/id.photo.types";
import type { BlockContentModuleFlow } from "@shared-types/page-content/block/shared.block.content.types";

export type AuthoredHeroBlockContentModule = Readonly<{
  kind: "hero";
  immersive?: boolean;
  photoId: PhotoId;
  flow?: BlockContentModuleFlow;
}>;
