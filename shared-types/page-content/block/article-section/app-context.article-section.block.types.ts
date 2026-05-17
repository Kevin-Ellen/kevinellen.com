// shared-types/page-content/block/article-section/app-context.article-section.block.types.ts

import type {
  AppStateArticleSectionHeadingBlock,
  AppStateArticleSectionBlock,
} from "@shared-types/page-content/block/article-section/app-state.article-section.block.types";
import type { AppContextBlock } from "@shared-types/page-content/block/app-context.block.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppContextArticleSectionHeadingBlock =
  AppStateArticleSectionHeadingBlock;

type RuntimeFields = Readonly<{
  heading: AppContextArticleSectionHeadingBlock;
  modules: readonly AppContextBlock[];
}>;

export type AppContextArticleSectionBlock = Replace<
  AppStateArticleSectionBlock,
  RuntimeFields
>;
