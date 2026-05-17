// shared-types/page-content/block/quote/app-state.quote.block.types.ts

import type { BlockFlow } from "@shared-types/page-content/block/shared.block.types";
import type { AuthoredQuoteBlock } from "@shared-types/page-content/block/quote/authored.quote.block.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type DeterministicFields = Readonly<{
  attribution: string | null;
  flow: BlockFlow;
}>;

export type AppStateQuoteBlock = Replace<
  AuthoredQuoteBlock,
  DeterministicFields
>;
