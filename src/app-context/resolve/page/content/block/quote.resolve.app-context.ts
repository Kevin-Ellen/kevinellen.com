// src/app-context/resolve/page/content/block/quote.resolve.app-context.ts

import type { AppStateQuoteBlockContentModule } from "@shared-types/page-content/block/quote/app-state.quote.block.page-content.types";
import type { AppContextQuoteBlockContentModule } from "@shared-types/page-content/block/quote/app-context.quote.block.page-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

export const appContextResolveQuoteBlockContentModule = (
  module: AppStateQuoteBlockContentModule,
  _context: AppContextPageContentResolverContext,
): AppContextQuoteBlockContentModule => {
  return module;
};
