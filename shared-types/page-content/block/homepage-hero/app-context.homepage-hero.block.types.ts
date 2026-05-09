// shared-types/page-content/block/homepage-hero/app-context.homepage-hero.block.types.ts

import type { AppStateHomepageHeroBlock } from "@shared-types/page-content/block/homepage-hero/app-state.homepage-hero.block.types";
import type { AppContextInline } from "@shared-types/page-content/inline/app-context.inline-content.types";
import type { AppContextInternalLink } from "@shared-types/links/app-context.links.types";
import type { AppContextPhotoMetadata } from "@shared-types/media/photo/app-context.photo.types";
import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

type ResolvedFields = Readonly<{
  intro: AppContextInline[];
  primaryLink: AppContextInternalLink | null;
  photo: AppContextPhotoMetadata;
}>;

export type AppContextHomepageHeroBlock = ReplaceAndOmit<
  AppStateHomepageHeroBlock,
  ResolvedFields,
  "photoId"
>;
