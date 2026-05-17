// shared-types/page-content/block/paragraph/app-render-context.paragraph.block.types.ts

import type { AppContextParagraphBlock } from "@shared-types/page-content/block/paragraph/app-context.paragraph.block.types";
import type { AppRenderContextInline } from "@shared-types/page-content/inline/app-render-context.inline-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type RuntimeFields = Readonly<{
  content: readonly AppRenderContextInline[];
}>;

export type AppRenderContextParagraphBlock = Replace<
  AppContextParagraphBlock,
  RuntimeFields
>;
