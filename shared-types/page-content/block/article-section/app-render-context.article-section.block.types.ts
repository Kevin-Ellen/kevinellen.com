// shared-types/page-content/block/article-section/app-render-context.article-section.block.types.ts

import type {
  AppContextArticleSectionHeadingBlock,
  AppContextArticleSectionBlock,
} from "@shared-types/page-content/block/article-section/app-context.article-section.block.types";
import type { AppRenderContextBlock } from "@shared-types/page-content/block/app-render-context.block.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppRenderContextArticleSectionHeadingBlock =
  AppContextArticleSectionHeadingBlock;

type RuntimeFields = Readonly<{
  heading: AppRenderContextArticleSectionHeadingBlock;
  modules: readonly AppRenderContextBlock[];
}>;

export type AppRenderContextArticleSectionBlock = Replace<
  AppContextArticleSectionBlock,
  RuntimeFields
>;

export type AppRenderContextArticleSectionModule =
  AppRenderContextArticleSectionBlock["modules"][number];

export type AppRenderContextArticleSectionHeading =
  AppRenderContextArticleSectionBlock["heading"];
