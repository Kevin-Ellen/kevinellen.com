// shared-types/page-content/block/section-links/app-render-context.section-links.block.types.ts

import type { AppContextSectionLinksBlock } from "@shared-types/page-content/block/section-links/app-context.section-links.block.types";
import type { AppRenderContextLink } from "@shared-types/links/app-render-context.links.types";
import type { SvgAssetId } from "@shared-types/assets/svg/id.svg.assets.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type SectionLinksIcon = Readonly<{
  id: SvgAssetId;
  width: number;
  height: number;
}>;

type SectionLinksSection = Replace<
  AppContextSectionLinksBlock["sections"][number],
  {
    link: AppRenderContextLink;
    icon: SectionLinksIcon | null;
  }
>;

type ResolvedFields = Readonly<{
  sections: readonly SectionLinksSection[];
}>;

export type AppRenderContextSectionLinksBlock = Replace<
  AppContextSectionLinksBlock,
  ResolvedFields
>;
