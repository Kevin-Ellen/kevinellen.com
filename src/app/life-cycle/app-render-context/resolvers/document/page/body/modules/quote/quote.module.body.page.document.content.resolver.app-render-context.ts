// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/quote/quote.module.body.page.document.content.resolver.app-render-context.ts

import type { QuoteModuleContentAppResolve } from "../../../../../../../../types/document/page/content/modules/quote/quote.module.content.page.document.app-resolve.type";
import type { QuoteModuleContentAppRenderContext } from "../../../../../../../../types/document/page/content/modules/quote/quote.module.content.page.document.app-render-context.type";

type Input = Readonly<{
  content: QuoteModuleContentAppResolve;
}>;

export const resolveQuoteModuleAppRenderContext = ({
  content,
}: Input): QuoteModuleContentAppRenderContext => ({
  ...content,
});
