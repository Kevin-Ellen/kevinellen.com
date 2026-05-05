// shared-types/page-content/block/homepage-hero/authored.homepage-hero.block.page-content.types.ts

import type { PhotoId } from "@shared-types/media/photo/id.photo.types";
import type { AuthoredBaseBlockContentModule } from "@shared-types/page-content/block/base/authored.base.block.page-content.types";
import type { AuthoredInlineContent } from "@shared-types/page-content/inline/authored.inline-content.page-content.types";
import type { AuthoredInternalLink } from "@shared-types/links/authored.links.types";

export type AuthoredHomepageHeroBlockContentModule =
  AuthoredBaseBlockContentModule<
    "homepageHero",
    {
      eyebrow?: string;
      title: string;
      intro?: AuthoredInlineContent[];
      photoId: PhotoId;
      primaryLink?: AuthoredInternalLink;
    }
  >;
