// src/rendering/body-content/block/list/list.block.renderer.ts

import type { AppRenderContextListBlock } from "@shared-types/page-content/block/list/app-render-context.list.block.types";

import { renderBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.helper";
import { renderInlineContent } from "@rendering/body-content/inline/inline.renderer";

const renderListItem = (
  item: AppRenderContextListBlock["items"][number],
): string => `<li>${renderInlineContent(item.content)}</li>`;

export const renderListBlock = (module: AppRenderContextListBlock): string => {
  const tag = module.style === "ordered" ? "ol" : "ul";

  return [
    `<${tag} class="m-contentBlock m-contentBlock--list ${renderBlockFlowClass(
      module.flow,
    )}">`,
    module.items.map(renderListItem).join(""),
    `</${tag}>`,
  ].join("");
};
