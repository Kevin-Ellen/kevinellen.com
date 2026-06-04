// shared-types/page-content/block/sequence/authored.sequence.block.types.ts

import type { AuthoredBaseBlock } from "@shared-types/page-content/block/base/authored.base.block.types";
import type { AuthoredInline } from "@shared-types/page-content/inline/authored.inline-content.types";
import type { PhotoId } from "@shared-types/media/photo/id.photo.types";

export type AuthoredSequenceBlock = AuthoredBaseBlock<
  "sequence",
  {
    immersive?: boolean;
    caption: readonly AuthoredInline[];
    photos: Readonly<Record<number, PhotoId>>;
  }
>;
