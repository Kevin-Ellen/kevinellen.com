// src/app-context/resolve/page-content/block/quote.resolve.app-context.ts

import type { AppStateQuoteBlock } from "@shared-types/page-content/block/quote/app-state.quote.block.types";
import type { AppContextQuoteBlock } from "@shared-types/page-content/block/quote/app-context.quote.block.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

export const appContextResolveQuoteBlock = (
  module: AppStateQuoteBlock,
  _context: AppContextPageContentResolverContext,
): AppContextQuoteBlock => {
  return module;
};
