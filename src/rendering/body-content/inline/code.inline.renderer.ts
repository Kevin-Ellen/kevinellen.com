// src/rendering/body-content/inline/code.inline.renderer.ts

import type { AppRenderContextCodeInline } from "@shared-types/page-content/inline/code/app-render-context.code.inline-content.types";

import { escapeHtml } from "@rendering/utils/html.escape.util.renderer";

export const renderCodeInline = (item: AppRenderContextCodeInline): string => {
  return `<code>${escapeHtml(item.value)}</code>`;
};
