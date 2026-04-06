// src/app/rendering/content/modules/list/list.render.module.ts

import type { RenderContextListModule } from "@app/renderContext/content/modules/list/list.module.renderContext.types";

import { renderInlineContent } from "@app/rendering/content/inline-content/inline-content.render";

export const renderListModule = (module: RenderContextListModule): string => {
  const tag = module.style === "ordered" ? "ol" : "ul";

  if (module.items.length === 0) return "";

  const items = module.items
    .map((item) => `<li>${renderInlineContent(item.content)}</li>`)
    .join("");

  return `<${tag}>${items}</${tag}>`;
};
