// packages/shared-types/src/content/modules/content.module.types.ts

import type { ParagraphModuleAuthored } from "@shared-types/content/modules/paragraph/paragraph.module.types";
import type { QuoteModuleAuthored } from "@shared-types/content/modules/quote/quote.module.types";

export type ContentLeafModuleAuthored =
  | ParagraphModuleAuthored
  | QuoteModuleAuthored;
