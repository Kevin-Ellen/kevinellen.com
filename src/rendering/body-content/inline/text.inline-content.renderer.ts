// src/rendering/body-content/inline/text.inline-content.renderer.ts

import type { AppRenderContextTextInlineContent } from "@shared-types/page-content/inline/text/app-render-context.text.inline-content.page-content.types";

import { escapeHtml } from "@rendering/utils/html.escape.util.renderer";

export const renderTextInlineContent = (
  item: AppRenderContextTextInlineContent,
): string => escapeHtml(item.value);
