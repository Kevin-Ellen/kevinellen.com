// shared-types/page-content/block/article-section/authored.article-section.block.types.ts

import type { AuthoredBlock } from "@shared-types/page-content/block/authored.block.types";

export type AuthoredArticleSectionHeadingBlock = Readonly<{
  text: string;
  visuallyHidden?: boolean;
  level: 2 | 3 | 4 | 5 | 6;
}>;

export type AuthoredArticleSectionBlock = Readonly<{
  kind: "articleSection";
  heading: AuthoredArticleSectionHeadingBlock;
  modules: readonly AuthoredBlock[];
}>;
