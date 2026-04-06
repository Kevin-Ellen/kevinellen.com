// src/app/appContext/content/modules/quote/quote.resolve.appContext.ts

import type { AppContextQuoteModule } from "@app/appContext/content/content.appContext.types";
import type { AppState } from "@app/appState/class.appState";
import type { QuoteModuleAuthored } from "@shared-types/content/modules/quote/quote.module.types";

export const resolveQuoteAppContext = (
  module: QuoteModuleAuthored,
  _appState: AppState,
): AppContextQuoteModule => {
  return {
    kind: "quote",
    text: module.text,
    id: module.id,
    attribution: module.attribution,
  };
};
