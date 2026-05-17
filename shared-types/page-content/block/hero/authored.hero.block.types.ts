// shared-types/page-content/block/hero/authored.hero.block.types.ts

import type { PhotoId } from "@shared-types/media/photo/id.photo.types";
import type { AuthoredBaseBlock } from "@shared-types/page-content/block/base/authored.base.block.types";

export type AuthoredHeroBlock = AuthoredBaseBlock<
  "hero",
  {
    immersive?: boolean;
    photoId: PhotoId;
  }
>;
