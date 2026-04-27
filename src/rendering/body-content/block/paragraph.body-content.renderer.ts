// src/rendering/body-content/block/paragraph.body-content.renderer.ts

import type { AppRenderContextBlockContentModule } from "@shared-types/page-content/block/app-render-context.block.page-content.types";

import { renderInlineContent } from "@rendering/body-content/inline/inline-content.body-content.renderer";
import { getBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.body-content.helper";

type ParagraphBlock = Extract<
  AppRenderContextBlockContentModule,
  { kind: "paragraph" }
>;

export const renderParagraphBlockContentModule = (
  module: ParagraphBlock,
): string => {
  return `<p class="m-contentBlock m-contentBlock--paragraph ${getBlockFlowClass(
    module.flow,
  )}">${renderInlineContent(module.content)}</p>`;
};
