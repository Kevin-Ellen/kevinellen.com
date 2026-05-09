// src/rendering/body-content/inline/strong.inline.renderer.ts

import type { AppRenderContextStrongInline } from "@shared-types/page-content/inline/strong/app-render-context.strong.inline-content.types";

import { renderInlineContent } from "@rendering/body-content/inline/inline.renderer";

export const renderStrongInlineContent = (
  item: AppRenderContextStrongInline,
): string => {
  return `<strong>${renderInlineContent(item.content)}</strong>`;
};
