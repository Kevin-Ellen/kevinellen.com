// src/rendering/body-content/block/list.body-content.renderer.ts

import type {
  AppRenderContextListBlockContentModule,
  AppRenderContextListModuleItem,
} from "@shared-types/page-content/block/list/app-render-context.list.block.page-content.types";

import { renderInlineContent } from "@rendering/body-content/inline/inline-content.body-content.renderer";
import { getBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.body-content.helper";

const renderListItem = (item: AppRenderContextListModuleItem): string => {
  return `<li>${renderInlineContent(item.content)}</li>`;
};

export const renderListBlockContentModule = (
  module: AppRenderContextListBlockContentModule,
): string => {
  const tag = module.style === "ordered" ? "ol" : "ul";

  return `<${tag} class="m-contentBlock m-contentBlock--list ${getBlockFlowClass(
    module.flow,
  )}">
    ${module.items.map(renderListItem).join("")}
  </${tag}>`;
};
