// shared-types/page-content/block/quote/authored.quote.block.types.ts

import type { AuthoredBaseBlock } from "@shared-types/page-content/block/base/authored.base.block.types";

export type AuthoredQuoteBlock = AuthoredBaseBlock<
  "quote",
  {
    id: string;
    text: string;
    attribution?: string;
  }
>;
