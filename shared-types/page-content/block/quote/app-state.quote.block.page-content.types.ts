// shared-types/page-content/block/quote/app-state.quote.block.page-content.types.ts

import type { AuthoredQuoteBlockContentModule } from "@shared-types/page-content/block/quote/authored.quote.block.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStateQuoteBlockContentModuleDeterministicFields = Readonly<{
  attribution: string | null;
}>;

export type AppStateQuoteBlockContentModule = Replace<
  AuthoredQuoteBlockContentModule,
  AppStateQuoteBlockContentModuleDeterministicFields
>;
