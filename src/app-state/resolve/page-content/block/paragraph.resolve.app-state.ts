// src/app-state/resolve/page-content/block/paragraph.resolve.app-state.ts

import type { AuthoredParagraphBlockContentModule } from "@shared-types/page-content/block/paragraph/authored.paragraph.block.page-content.types";
import type { AppStateParagraphBlockContentModule } from "@shared-types/page-content/block/paragraph/app-state.paragraph.block.page-content.types";

import { appStateResolveInlineContent } from "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state";

export const appStateResolveParagraphBlockContentModule = (
  module: AuthoredParagraphBlockContentModule,
): AppStateParagraphBlockContentModule => {
  return {
    ...module,
    flow: module.flow ?? "content",
    content: module.content.map(appStateResolveInlineContent),
  };
};
