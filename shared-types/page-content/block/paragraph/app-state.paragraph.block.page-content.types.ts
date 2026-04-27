// shared-types/page-content/block/paragraph/app-state.paragraph.block.page-content.types.ts

import type { BlockContentModuleFlow } from "@shared-types/page-content/block/shared.block.content.types";
import type { AuthoredParagraphBlockContentModule } from "@shared-types/page-content/block/paragraph/authored.paragraph.block.page-content.types";
import type { AppStateInlineContent } from "@shared-types/page-content/inline/app-state.inline-content.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStateParagraphBlockContentModuleDeterministicFields = Readonly<{
  flow: BlockContentModuleFlow;
  content: readonly AppStateInlineContent[];
}>;

export type AppStateParagraphBlockContentModule = Replace<
  AuthoredParagraphBlockContentModule,
  AppStateParagraphBlockContentModuleDeterministicFields
>;
