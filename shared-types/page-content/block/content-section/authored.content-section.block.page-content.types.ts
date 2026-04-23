// shared-types/page-content/block/content-section/authored.content-section.block.page-content.types.ts

import type { AuthoredBlockContentModule } from "@shared-types/page-content/block/authored.block.page-content.types";

export type AuthoredContentSectionHeadingBlockContentModule = Readonly<{
  text: string;
  visuallyHidden?: boolean;
  level: 2 | 3 | 4 | 5 | 6;
}>;

export type AuthoredContentSectionBlockContentModule = Readonly<{
  kind: "contentSection";
  heading: AuthoredContentSectionHeadingBlockContentModule;
  modules: readonly AuthoredBlockContentModule[];
}>;
