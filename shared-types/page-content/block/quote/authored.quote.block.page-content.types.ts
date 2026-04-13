// shared-types/page-content/block/quote/authored.quote.block.page-content.types.ts

export type AuthoredQuoteBlockContentModule = Readonly<{
  kind: "quote";
  id: string;
  text: string;
  attribution?: string;
}>;
