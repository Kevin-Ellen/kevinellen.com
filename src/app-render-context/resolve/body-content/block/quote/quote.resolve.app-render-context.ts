// src/app-render-context/resolve/body-content/block/quote/quote.resolve.app-render-context.ts

import type { AppContextQuoteBlock } from "@shared-types/page-content/block/quote/app-context.quote.block.types";
import type { AppRenderContextQuoteBlock } from "@shared-types/page-content/block/quote/app-render-context.quote.block.types";

export const appRenderContextResolveQuoteBlock = (
  block: AppContextQuoteBlock,
): AppRenderContextQuoteBlock => block;
