// shared-types/page-content/block/paragraph/app-context.paragraph.block.types.ts

import type { AppStateParagraphBlock } from "@shared-types/page-content/block/paragraph/app-state.paragraph.block.types";
import type { AppContextInline } from "@shared-types/page-content/inline/app-context.inline-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type RuntimeFields = Readonly<{
  content: readonly AppContextInline[];
}>;

export type AppContextParagraphBlock = Replace<
  AppStateParagraphBlock,
  RuntimeFields
>;
