// src/app/appContext/content/modules/quote/quote.resolve.appContext.ts

import type { AppContextQuoteModule } from "@app/appContext/content/modules/quote/quote.module.appContext.types";
import type { QuoteModuleAuthored } from "@shared-types/content/modules/quote/quote.module.types";
import type { AppContextModuleResolverDependencies } from "@app/appContext/content/modules/module.registry.appContext";

export const resolveQuoteAppContext = (
  module: QuoteModuleAuthored,
  _dependencies: AppContextModuleResolverDependencies,
): AppContextQuoteModule => {
  return {
    kind: "quote",
    text: module.text,
    id: module.id,
    attribution: module.attribution,
  };
};
