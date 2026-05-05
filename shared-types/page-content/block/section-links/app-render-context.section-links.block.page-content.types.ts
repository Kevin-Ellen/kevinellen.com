// shared-types/page-content/block/section-links/app-render-context.section-links.block.page-content.types.ts

import type { AppContextSectionLinksBlockContentModule } from "@shared-types/page-content/block/section-links/app-context.section-links.block.page-content.types";
import type { AppRenderContextLink } from "@shared-types/links/app-render-context.links.types";
import type { SvgAssetId } from "@shared-types/assets/svg/id.svg.assets.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppRenderContextSectionLinksIcon = Readonly<{
  id: SvgAssetId;
  width: number;
  height: number;
}>;

export type AppRenderContextSectionLinksSection = Replace<
  AppContextSectionLinksBlockContentModule["sections"][number],
  {
    link: AppRenderContextLink;
    icon: AppRenderContextSectionLinksIcon | null;
  }
>;

type AppRenderContextSectionLinksBlockContentModuleResolvedFields = Readonly<{
  sections: readonly AppRenderContextSectionLinksSection[];
}>;

export type AppRenderContextSectionLinksBlockContentModule = Replace<
  AppContextSectionLinksBlockContentModule,
  AppRenderContextSectionLinksBlockContentModuleResolvedFields
>;
