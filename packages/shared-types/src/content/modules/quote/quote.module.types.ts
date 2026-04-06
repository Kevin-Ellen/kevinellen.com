// packages/shared-types/src/content/modules/quote/quote.module.types.ts

export type QuoteModuleAuthored = {
  kind: "quote";
  id: string;
  text: string;
  attribution?: string;
};
