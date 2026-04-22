// shared-types/page-content/block/paragraph/app-render-context.paragraph.block.page-content.types.ts

import type { AppContextParagraphBlockContentModule } from "@shared-types/page-content/block/paragraph/app-context.paragraph.block.page-content.types";
import type { AppRenderContextInlineContent } from "@shared-types/page-content/inline/app-render-context.inline-content.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppRenderContextParagraphBlockContentModuleRuntimeFields = Readonly<{
  content: readonly AppRenderContextInlineContent[];
}>;

export type AppRenderContextParagraphBlockContentModule = Replace<
  AppContextParagraphBlockContentModule,
  AppRenderContextParagraphBlockContentModuleRuntimeFields
>;

export type AppRenderContextParagraphInlineItem =
  AppRenderContextParagraphBlockContentModule["content"][number];
