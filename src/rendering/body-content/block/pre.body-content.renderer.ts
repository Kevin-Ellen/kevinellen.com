// src/rendering/body-content/block/pre.body-content.renderer.ts

import type { AppRenderContextBlockContentModule } from "@shared-types/page-content/block/app-render-context.block.page-content.types";

import { escapeHtml } from "@rendering/utils/html.escape.util.renderer";

import { getBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.body-content.helper";

type PreBlock = Extract<AppRenderContextBlockContentModule, { kind: "pre" }>;

export const renderPreBlockContentModule = (module: PreBlock): string => {
  return `<pre class="m-contentBlock m-pre ${getBlockFlowClass(
    module.flow,
  )}"><code>${escapeHtml(module.value)}</code></pre>`;
};
