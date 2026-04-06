// src/app/rendring/content/modules/paragraph/paragraph.render.module.ts

import type { RenderContextParagraphModule } from "@app/renderContext/content/content.renderContext.types";

import { escapeHtmlContent } from "@app/rendering/utils/escapeContent.util";

export const paragraphRenderModule = (
  module: RenderContextParagraphModule,
): string => {
  return `<p>${escapeHtmlContent(module.text)}</p>`;
};
