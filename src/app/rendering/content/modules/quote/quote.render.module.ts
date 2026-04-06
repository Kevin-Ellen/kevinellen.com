// src/app/rendering/content/modules/quote/quote.render.module.ts

import type { RenderContextQuoteModule } from "@app/renderContext/content/modules/quote/quote.module.renderContext.types";

import { escapeHtmlContent } from "@app/rendering/utils/escapeContent.util";

export const quoteRenderModule = (module: RenderContextQuoteModule): string => {
  const id = module.id;

  const quote = `<blockquote aria-describedby="${id}">
    ${escapeHtmlContent(module.text)}
  </blockquote>`;

  const attribution = module.attribution
    ? `<figcaption id="${id}">
        ${escapeHtmlContent(module.attribution)}
      </figcaption>`
    : "";

  return `<figure>${quote}${attribution}</figure>`;
};
