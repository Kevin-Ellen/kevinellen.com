// src/app/renderContext/content/modules/quote/quote.resolve.renderContext.ts

import type { AppContextQuoteModule } from "@app/appContext/content/content.appContext.types";
import type { RenderContextQuoteModule } from "@app/renderContext/content/content.renderContext.types";

export const resolveQuoteRenderContext = (
  module: AppContextQuoteModule,
): RenderContextQuoteModule => {
  return {
    kind: "quote",
    id: module.id,
    text: module.text,
    attribution: module.attribution,
  };
};
