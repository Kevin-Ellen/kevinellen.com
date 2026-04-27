// shared-types/page-content/block/article-section/authored.article-section.block.page-content.types.ts

import type { AuthoredBlockContentModule } from "@shared-types/page-content/block/authored.block.page-content.types";

export type AuthoredArticleSectionHeadingBlockContentModule = Readonly<{
  text: string;
  visuallyHidden?: boolean;
  level: 2 | 3 | 4 | 5 | 6;
}>;

export type AuthoredArticleSectionBlockContentModule = Readonly<{
  kind: "articleSection";
  heading: AuthoredArticleSectionHeadingBlockContentModule;
  modules: readonly AuthoredBlockContentModule[];
}>;
