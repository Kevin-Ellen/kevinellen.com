// shared-types/page-content/block/homepage-hero/app-context.homepage-hero.block.page-content.types.ts

import type { AppStateHomepageHeroBlockContentModule } from "@shared-types/page-content/block/homepage-hero/app-state.homepage-hero.block.page-content.types";
import type { AppContextInlineContent } from "@shared-types/page-content/inline/app-context.inline-content.page-content.types";
import type { AppContextInternalLink } from "@shared-types/links/app-context.links.types";
import type { AppContextPhotoMetadata } from "@shared-types/media/photo/app-context.photo.types";
import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextHomepageHeroBlockContentModuleFields = Readonly<{
  intro: AppContextInlineContent[];
  primaryLink: AppContextInternalLink | null;
  photo: AppContextPhotoMetadata;
}>;

export type AppContextHomepageHeroBlockContentModule = ReplaceAndOmit<
  AppStateHomepageHeroBlockContentModule,
  AppContextHomepageHeroBlockContentModuleFields,
  "photoId"
>;
