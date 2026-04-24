// shared-types/page-content/block/quote/authored.quote.block.page-content.types.ts

import type { BlockContentModuleFlow } from "@shared-types/page-content/block/shared.block.content.types";

export type AuthoredQuoteBlockContentModule = Readonly<{
  kind: "quote";
  id: string;
  text: string;
  attribution?: string;
  flow?: BlockContentModuleFlow;
}>;
