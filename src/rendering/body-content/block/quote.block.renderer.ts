// src/rendering/body-content/block/quote.block.renderer.ts

import type { AppRenderContextQuoteBlock } from "@shared-types/page-content/block/quote/app-render-context.quote.block.types";

import {
  escapeAttribute,
  escapeHtml,
} from "@rendering/utils/html.escape.util.renderer";

import { renderBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.helper";

export const renderQuoteBlock = (
  module: AppRenderContextQuoteBlock,
): string => {
  const attributionId = module.attribution ? module.id : null;

  const describedByAttribute = attributionId
    ? ` aria-describedby="${escapeAttribute(attributionId)}"`
    : "";

  const attribution = module.attribution
    ? `<figcaption id="${escapeAttribute(module.id)}" class="m-quote__attribution">${escapeHtml(module.attribution)}</figcaption>`
    : "";

  return [
    `<figure class="m-contentBlock m-quote ${renderBlockFlowClass(module.flow)}">`,
    `<blockquote class="m-quote__body"${describedByAttribute}>${escapeHtml(module.text)}</blockquote>`,
    attribution,
    `</figure>`,
  ].join("");
};
