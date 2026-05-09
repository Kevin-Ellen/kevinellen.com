// src/rendering/body-content/inline/emphasis.inline.renderer.ts

import type { AppRenderContextEmphasisInline } from "@shared-types/page-content/inline/emphasis/app-render-context.emphasis.inline-content.types";

import { renderInlineContent } from "@rendering/body-content/inline/inline.renderer";

export const renderEmphasisInline = (
  item: AppRenderContextEmphasisInline,
): string => {
  return `<em>${renderInlineContent(item.content)}</em>`;
};
