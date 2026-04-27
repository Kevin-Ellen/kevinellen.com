// src/rendering/body-content/inline/emphasis.inline-content.renderer.ts

import type { AppRenderContextEmphasisInlineContent } from "@shared-types/page-content/inline/emphasis/app-render-context.emphasis.inline-content.page-content.types";

import { renderInlineContent } from "@rendering/body-content/inline/inline-content.body-content.renderer";

export const renderEmphasisInlineContent = (
  item: AppRenderContextEmphasisInlineContent,
): string => {
  return `<em>${renderInlineContent(item.content)}</em>`;
};
