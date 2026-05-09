// shared-types/page-content/block/article-section/app-state.article-section.block.types.ts

import type {
  AuthoredArticleSectionHeadingBlock,
  AuthoredArticleSectionBlock,
} from "@shared-types/page-content/block/article-section/authored.article-section.block.types";
import type { AppStateBlock } from "@shared-types/page-content/block/app-state.block.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type HeadingDeterministicFields = Readonly<{
  visuallyHidden: boolean;
}>;

export type AppStateArticleSectionHeadingBlock = Replace<
  AuthoredArticleSectionHeadingBlock,
  HeadingDeterministicFields
>;

type DeterministicFields = Readonly<{
  heading: AppStateArticleSectionHeadingBlock;
  modules: readonly AppStateBlock[];
}>;

export type AppStateArticleSectionBlock = Replace<
  AuthoredArticleSectionBlock,
  DeterministicFields
>;
