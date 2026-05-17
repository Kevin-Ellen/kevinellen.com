// src/rendering/body-content/block/pre/pre.block.template.tsx

import type { AppRenderContextBlock } from "@shared-types/page-content/block/app-render-context.block.types";

import { getBlockFlowClassName } from "@rendering/body-content/block/helpers/flow.block.helper";
import { CodeTemplate } from "@rendering/shared/code.shared.template";

type PreBlock = Extract<AppRenderContextBlock, { kind: "pre" }>;

type PreBlockTemplateProps = Readonly<{
  block: PreBlock;
}>;

export const PreBlockTemplate = ({ block }: PreBlockTemplateProps) => (
  <pre className={`m-contentBlock m-pre ${getBlockFlowClassName(block.flow)}`}>
    <CodeTemplate value={block.value} language={block.language ?? null} />
  </pre>
);
