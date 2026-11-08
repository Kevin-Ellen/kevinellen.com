// src/app/life-cycle/app-resolve/resolvers/content/modules/quote/quote.module.content.resolver.app-resolve.ts

import type { QuoteModuleContentAppInit } from "../../../../../../../shared/types/content/modules/quote.module.content.shared.app-init.type";
import type { QuoteModuleContentAppResolve } from "../../../../../../types/document/page/content/modules/quote/quote.module.content.page.document.app-resolve.type";

type Input = Readonly<{
  content: QuoteModuleContentAppInit;
}>;

export const resolveQuoteModuleAppResolve = ({
  content,
}: Input): QuoteModuleContentAppResolve => ({
  ...content,
});
