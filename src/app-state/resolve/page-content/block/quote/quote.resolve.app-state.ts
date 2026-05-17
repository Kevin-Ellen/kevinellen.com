// src/app-state/resolve/page-content/block/quote/quote.resolve.app-state.ts

import type { AuthoredQuoteBlock } from "@shared-types/page-content/block/quote/authored.quote.block.types";
import type { AppStateQuoteBlock } from "@shared-types/page-content/block/quote/app-state.quote.block.types";

export const appStateResolveQuoteBlock = (
  module: AuthoredQuoteBlock,
): AppStateQuoteBlock => {
  return {
    ...module,
    flow: module.flow ?? "content",
    attribution: module.attribution ?? null,
  };
};
