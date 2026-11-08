// src/shared/resolvers/content/modules/quote/quote.module.content.resolver.shared.app-init.ts

import type { QuoteModuleContentAuthored } from "../../../../../content-schema/content/modules/quote.module.content.content-schema.authored.type";
import type { QuoteModuleContentAppInit } from "../../../../types/content/modules/quote.module.content.shared.app-init.type";

type Input = Readonly<{
  authored: QuoteModuleContentAuthored;
}>;

export const resolveQuoteModuleAppInit = ({
  authored,
}: Input): QuoteModuleContentAppInit => ({
  ...authored,
  attribution: authored.attribution ?? null,
});
