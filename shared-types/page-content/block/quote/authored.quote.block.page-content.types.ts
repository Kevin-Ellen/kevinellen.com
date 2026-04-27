// shared-types/page-content/block/quote/authored.quote.block.page-content.types.ts

import type { AuthoredBaseBlockContentModule } from "@shared-types/page-content/block/base/authored.base.block.page-content.types";

export type AuthoredQuoteBlockContentModule = AuthoredBaseBlockContentModule<
  "quote",
  {
    id: string;
    text: string;
    attribution?: string;
  }
>;
