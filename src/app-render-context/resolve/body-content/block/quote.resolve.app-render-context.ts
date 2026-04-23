// src/app-render-context/resolve/body-content/block/quote.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextQuoteBlockContentModule } from "@shared-types/page-content/block/quote/app-context.quote.block.page-content.types";
import type { AppRenderContextQuoteBlockContentModule } from "@shared-types/page-content/block/quote/app-render-context.quote.block.page-content.types";

export const resolveQuoteBlockContentModuleAppRenderContext = (
  _appContext: AppContext,
  module: AppContextQuoteBlockContentModule,
): AppRenderContextQuoteBlockContentModule => {
  return module;
};
