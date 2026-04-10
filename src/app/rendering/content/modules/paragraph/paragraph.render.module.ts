// src/app/rendering/content/modules/paragraph/paragraph.render.module.ts

import type { RenderContextParagraphModule } from "@app/renderContext/content/modules/paragraph/paragraph.module.renderContext.types";

import { renderInlineContent } from "@app/rendering/content/inline-content/inline-content.render";

export const renderParagraphModule = (
  module: RenderContextParagraphModule,
): string => {
  return `<p>${renderInlineContent(module.content)}</p>`;
};
