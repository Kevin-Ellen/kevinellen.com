// src/rendering/body-content/block/paragraph/paragraph.block.template.tsx

import type { AppRenderContextBlock } from "@shared-types/page-content/block/app-render-context.block.types";

import { getBlockFlowClassName } from "@rendering/body-content/block/helpers/flow.block.helper";
import { InlineContentTemplate } from "@rendering/body-content/inline/inline.template";

type ParagraphBlock = Extract<AppRenderContextBlock, { kind: "paragraph" }>;

type ParagraphBlockTemplateProps = Readonly<{
  block: ParagraphBlock;
}>;

export const ParagraphBlockTemplate = ({
  block,
}: ParagraphBlockTemplateProps) => (
  <p
    className={`m-contentBlock m-contentBlock--paragraph ${getBlockFlowClassName(
      block.flow,
    )}`}
  >
    <InlineContentTemplate content={block.content} />
  </p>
);
