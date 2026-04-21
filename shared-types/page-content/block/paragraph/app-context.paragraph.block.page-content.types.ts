// shared-types/page-content/block/paragraph/app-context.paragraph.block.page-content.types.ts

import type { AppStateParagraphBlockContentModule } from "@shared-types/page-content/block/paragraph/app-state.paragraph.block.page-content.types";
import type { AppContextInlineContent } from "@shared-types/page-content/inline/app-context.inline-content.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextParagraphBlockContentModuleRuntimeFields = Readonly<{
  content: readonly AppContextInlineContent[];
}>;

export type AppContextParagraphBlockContentModule = Replace<
  AppStateParagraphBlockContentModule,
  AppContextParagraphBlockContentModuleRuntimeFields
>;
