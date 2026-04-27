// src/rendering/body-content/block/quote.body-content.renderer.ts

import type { AppRenderContextQuoteBlockContentModule } from "@shared-types/page-content/block/quote/app-render-context.quote.block.page-content.types";

import {
  escapeAttribute,
  escapeHtml,
} from "@rendering/utils/html.escape.util.renderer";

import { getBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.body-content.helper";

export const renderQuoteBlockContentModule = (
  module: AppRenderContextQuoteBlockContentModule,
): string => {
  const attributionId = module.attribution ? module.id : null;

  const attribution = module.attribution
    ? `<figcaption id="${escapeAttribute(module.id)}" class="m-quote__attribution">
        ${escapeHtml(module.attribution)}
      </figcaption>`
    : "";

  const describedByAttribute = attributionId
    ? ` aria-describedby="${escapeAttribute(attributionId)}"`
    : "";

  return `<figure class="m-contentBlock m-quote ${getBlockFlowClass(
    module.flow,
  )}">
    <blockquote class="m-quote__body"${describedByAttribute}>
      ${escapeHtml(module.text)}
    </blockquote>
    ${attribution}
  </figure>`;
};
