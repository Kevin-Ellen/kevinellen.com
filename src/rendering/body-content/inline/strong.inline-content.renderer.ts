// src/rendering/body-content/inline/strong.inline-content.renderer.ts

import type { AppRenderContextStrongInlineContent } from "@shared-types/page-content/inline/strong/app-render-context.strong.inline-content.page-content.types";

import { renderInlineContent } from "@rendering/body-content/inline/inline-content.body-content.renderer";

export const renderStrongInlineContent = (
  item: AppRenderContextStrongInlineContent,
): string => {
  return `<strong>${renderInlineContent(item.content)}</strong>`;
};
