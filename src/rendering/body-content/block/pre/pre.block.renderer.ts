// src/rendering/body-content/block/pre/pre.block.renderer.ts

import type { AppRenderContextBlock } from "@shared-types/page-content/block/app-render-context.block.types";

import { renderBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.helper";

import { escapeHtml } from "@rendering/utils/html.escape.util.renderer";

type PreBlock = Extract<AppRenderContextBlock, { kind: "pre" }>;

export const renderPreBlock = (module: PreBlock): string => {
  return [
    `<pre class="m-contentBlock m-pre ${renderBlockFlowClass(module.flow)}">`,
    `<code>${escapeHtml(module.value)}</code>`,
    `</pre>`,
  ].join("");
};
