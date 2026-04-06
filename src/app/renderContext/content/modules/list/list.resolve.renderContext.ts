// src/app/renderContext/content/modules/list/list.resolve.renderContext.ts

import type { AppContextListModule } from "@app/appContext/content/modules/list/list.module.appContext.types";
import type { RenderContextListModule } from "@app/renderContext/content/modules/list/list.module.renderContext.types";

import { resolveInlineContentRenderContext } from "@app/appContext/content/inline-content/inline-content.resolve.renderContext";

export const resolveListRenderContext = (
  module: AppContextListModule,
): RenderContextListModule => {
  return {
    kind: "list",
    style: module.style,
    items: module.items.map((item) => ({
      content: resolveInlineContentRenderContext(item.content),
    })),
  };
};
