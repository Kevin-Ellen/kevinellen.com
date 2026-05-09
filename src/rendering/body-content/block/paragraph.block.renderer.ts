// src/rendering/body-content/block/paragraph.block.renderer.ts

import type { AppRenderContextBlock } from "@shared-types/page-content/block/app-render-context.block.types";

import { renderInlineContent } from "@rendering/body-content/inline/inline.renderer";
import { renderBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.helper";

type ParagraphBlock = Extract<AppRenderContextBlock, { kind: "paragraph" }>;

export const renderParagraphBlock = (module: ParagraphBlock): string => {
  return `<p class="m-contentBlock m-contentBlock--paragraph ${renderBlockFlowClass(
    module.flow,
  )}">${renderInlineContent(module.content)}</p>`;
};
