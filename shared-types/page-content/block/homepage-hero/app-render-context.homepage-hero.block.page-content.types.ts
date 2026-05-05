// shared-types/page-content/block/homepage-hero/app-render-context.homepage-hero.block.page-content.types.ts

import type { AppContextHomepageHeroBlockContentModule } from "@shared-types/page-content/block/homepage-hero/app-context.homepage-hero.block.page-content.types";
import type { AppRenderContextInlineContent } from "@shared-types/page-content/inline/app-render-context.inline-content.page-content.types";
import type { AppRenderContextLink } from "@shared-types/links/app-render-context.links.types";
import type { AppRenderContextPhoto } from "@shared-types/media/photo/app-render-context.photo.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppRenderContextHomepageHeroPhoto = Pick<
  AppRenderContextPhoto,
  "src" | "srcset" | "sizes" | "alt" | "width" | "height" | "ratio"
>;

type AppRenderContextHomepageHeroBlockContentModuleFields = Readonly<{
  intro: AppRenderContextInlineContent[];
  primaryLink: AppRenderContextLink | null;
  photo: AppRenderContextHomepageHeroPhoto;
}>;

export type AppRenderContextHomepageHeroBlockContentModule = Replace<
  AppContextHomepageHeroBlockContentModule,
  AppRenderContextHomepageHeroBlockContentModuleFields
>;
