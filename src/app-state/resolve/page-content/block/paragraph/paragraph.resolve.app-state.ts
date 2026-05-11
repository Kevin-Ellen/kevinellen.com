// src/app-state/resolve/page-content/block/paragraph/paragraph.resolve.app-state.ts

import type { AuthoredParagraphBlock } from "@shared-types/page-content/block/paragraph/authored.paragraph.block.types";
import type { AppStateParagraphBlock } from "@shared-types/page-content/block/paragraph/app-state.paragraph.block.types";

import { appStateResolveInline } from "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state";

export const appStateResolveParagraphBlock = (
  module: AuthoredParagraphBlock,
): AppStateParagraphBlock => {
  return {
    ...module,
    flow: module.flow ?? "content",
    content: module.content.map(appStateResolveInline),
  };
};
