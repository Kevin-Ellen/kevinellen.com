// src/rendering/body-footer/colophon.body-footer.renderer.ts

import type { AppRenderContextBodyFooterColophon } from "@app-render-context/types/body-footer.app-render-context.types";

import { escapeHtml } from "@rendering/utils/html.escape.util.renderer";

const renderColophonItem = (
  item: AppRenderContextBodyFooterColophon["items"][number],
): string => {
  return `<p><span class="u-sr-only">${escapeHtml(item.label)}: </span>${escapeHtml(item.value)}</p>`;
};

export const renderBodyFooterColophon = (
  colophon: AppRenderContextBodyFooterColophon,
): string => {
  return `<div class="l-footer__meta">
    ${colophon.items.map(renderColophonItem).join("")}
  </div>`;
};
