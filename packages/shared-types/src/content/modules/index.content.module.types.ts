// packages/shared-types/src/content/modules/content.module.types.ts

import type { ParagraphModuleAuthored } from "@shared-types/content/modules/paragraph/paragraph.module.types";
import type { QuoteModuleAuthored } from "@shared-types/content/modules/quote/quote.module.types";
import type { ListModuleAuthored } from "@shared-types/content/modules/list/list.module.types";
import type { HeroModuleAuthored } from "@shared-types/content/modules/hero/hero.module.types";

export type ContentModuleAuthored =
  | ParagraphModuleAuthored
  | QuoteModuleAuthored
  | ListModuleAuthored
  | HeroModuleAuthored;
