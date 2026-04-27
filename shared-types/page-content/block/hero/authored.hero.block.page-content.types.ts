// shared-types/page-content/block/hero/authored.hero.block.page-content.types.ts

import type { PhotoId } from "@shared-types/media/photo/id.photo.types";
import type { AuthoredBaseBlockContentModule } from "@shared-types/page-content/block/base/authored.base.block.page-content.types";

export type AuthoredHeroBlockContentModule = AuthoredBaseBlockContentModule<
  "hero",
  {
    immersive?: boolean;
    photoId: PhotoId;
  }
>;
