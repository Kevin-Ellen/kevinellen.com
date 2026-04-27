// src/rendering/body-content/inline/code.inline-content.renderer.ts

import type { AppRenderContextCodeInlineContent } from "@shared-types/page-content/inline/code/app-render-context.code.inline-content.page-content.types";

import { escapeHtml } from "@rendering/utils/html.escape.util.renderer";

export const renderCodeInlineContent = (
  item: AppRenderContextCodeInlineContent,
): string => {
  return `<code>${escapeHtml(item.value)}</code>`;
};
