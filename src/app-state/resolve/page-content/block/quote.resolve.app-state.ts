// src/app-state/resolve/page-content/block/quote.resolve.app-state.ts

import type { AuthoredQuoteBlockContentModule } from "@shared-types/page-content/block/quote/authored.quote.block.page-content.types";
import type { AppStateQuoteBlockContentModule } from "@shared-types/page-content/block/quote/app-state.quote.block.page-content.types";

export const appStateResolveQuoteBlockContentModule = (
  module: AuthoredQuoteBlockContentModule,
): AppStateQuoteBlockContentModule => {
  return {
    ...module,
    flow: module.flow ?? "content",
    attribution: module.attribution ?? null,
  };
};
