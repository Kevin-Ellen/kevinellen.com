// src/content-schema/content/modules/article-section.module.content.content-schema.authored.type.ts

import type { ModuleContentAuthored } from "./module.content.content-schema.authored.type";

type ArticleSectionEntryModuleAuthored = Exclude<
  ModuleContentAuthored,
  { kind: "articleSection" }
>;
type ArticleSectionEntryAuthored = Readonly<{
  layout: "reading" | "frame" | "none";
  module: ArticleSectionEntryModuleAuthored;
}>;

export type ArticleSectionModuleContentAuthored = Readonly<{
  kind: "articleSection";

  heading: Readonly<{
    id: string;
    text: string;
    level: 2 | 3 | 4 | 5 | 6;
  }>;

  entries: readonly ArticleSectionEntryAuthored[];
}>;
