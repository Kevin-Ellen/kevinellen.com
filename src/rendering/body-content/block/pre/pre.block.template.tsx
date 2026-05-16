// src/rendering/body-content/block/pre/pre.block.template.tsx

import type { AppRenderContextBlock } from "@shared-types/page-content/block/app-render-context.block.types";

import { getBlockFlowClassName } from "@rendering/body-content/block/helpers/flow.block.helper";

type PreBlock = Extract<AppRenderContextBlock, { kind: "pre" }>;

type PreBlockTemplateProps = Readonly<{
  block: PreBlock;
}>;

export const PreBlockTemplate = ({ block }: PreBlockTemplateProps) => (
  <pre className={`m-contentBlock m-pre ${getBlockFlowClassName(block.flow)}`}>
    <code>{block.value}</code>
  </pre>
);
