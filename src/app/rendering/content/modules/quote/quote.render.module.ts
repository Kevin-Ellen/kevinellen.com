// src/app/rendering/content/modules/quote/quote.render.module.ts

import type { RenderContextQuoteModule } from "@app/renderContext/content/content.renderContext.types";

import { escapeHtmlContent } from "@app/rendering/utils/escapeContent.util";

export const quoteRenderModule = (module: RenderContextQuoteModule): string => {
  const quote = `<blockquote>${escapeHtmlContent(module.text)}</blockquote>`;

  const attribution = module.attribution
    ? `<figcaption>${escapeHtmlContent(module.attribution)}</figcaption>`
    : "";

  return `<figure class="m-quote">${quote}${attribution}</figure>`;
};
