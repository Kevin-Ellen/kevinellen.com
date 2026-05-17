// shared-types/page-content/block/homepage-hero/app-render-context.homepage-hero.block.types.ts

import type { AppContextHomepageHeroBlock } from "@shared-types/page-content/block/homepage-hero/app-context.homepage-hero.block.types";
import type { AppRenderContextInline } from "@shared-types/page-content/inline/app-render-context.inline-content.types";
import type { AppRenderContextLink } from "@shared-types/links/app-render-context.links.types";
import type { AppRenderContextPhoto } from "@shared-types/media/photo/app-render-context.photo.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppRenderContextHomepageHeroPhoto = Pick<
  AppRenderContextPhoto,
  "src" | "srcset" | "sizes" | "alt" | "width" | "height" | "ratio"
>;

type ResolvedFields = Readonly<{
  intro: AppRenderContextInline[];
  primaryLink: AppRenderContextLink | null;
  photo: AppRenderContextHomepageHeroPhoto;
}>;

export type AppRenderContextHomepageHeroBlock = Replace<
  AppContextHomepageHeroBlock,
  ResolvedFields
>;
