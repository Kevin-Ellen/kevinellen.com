// src/shared/types/content/modules/quote.module.content.shared.app-init.type.ts

import type { QuoteModuleContentAuthored } from "../../../../content-schema/content/modules/quote.module.content.content-schema.authored.type";

export type QuoteModuleContentAppInit = Omit<
  QuoteModuleContentAuthored,
  "attribution"
> & {
  attribution: string | null;
};
