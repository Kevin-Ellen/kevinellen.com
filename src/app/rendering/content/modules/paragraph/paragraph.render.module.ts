// src/app/rendering/content/modules/paragraph/paragraph.render.module.ts

import type { RenderContextParagraphModule } from "@app/renderContext/content/content.renderContext.types";

import {
  escapeAttribute,
  escapeHtmlContent,
} from "@app/rendering/utils/escapeContent.util";

const renderInlineContent = (
  content: RenderContextParagraphModule["content"],
): string => {
  return content
    .map((item) => {
      switch (item.kind) {
        case "text":
          return escapeHtmlContent(item.value);

        case "link": {
          const target = item.isExternal ? ' target="_blank"' : "";
          const rel = item.isExternal ? ' rel="noopener noreferrer"' : "";

          return `<a href="${escapeAttribute(item.href)}"${target}${rel}>${escapeHtmlContent(item.text)}</a>`;
        }
      }
    })
    .join("");
};

export const renderParagraphModule = (
  module: RenderContextParagraphModule,
): string => {
  return `<p>${renderInlineContent(module.content)}</p>`;
};
