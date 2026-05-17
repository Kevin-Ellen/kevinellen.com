// shared-types/page-content/block/homepage-hero/authored.homepage-hero.block.types.ts

import type { PhotoId } from "@shared-types/media/photo/id.photo.types";
import type { AuthoredBaseBlock } from "@shared-types/page-content/block/base/authored.base.block.types";
import type { AuthoredInline } from "@shared-types/page-content/inline/authored.inline-content.types";
import type { AuthoredInternalLink } from "@shared-types/links/authored.links.types";

export type AuthoredHomepageHeroBlock = AuthoredBaseBlock<
  "homepageHero",
  {
    eyebrow?: string;
    title: string;
    intro?: AuthoredInline[];
    photoId: PhotoId;
    primaryLink?: AuthoredInternalLink;
  }
>;
