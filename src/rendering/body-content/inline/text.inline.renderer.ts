// src/rendering/body-content/inline/text.inline.renderer.ts

import type { AppRenderContextTextInline } from "@shared-types/page-content/inline/text/app-render-context.text.inline-content.types";

import { escapeHtml } from "@rendering/utils/html.escape.util.renderer";

export const renderTextInline = (item: AppRenderContextTextInline): string =>
  escapeHtml(item.value);
