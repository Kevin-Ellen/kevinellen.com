// src/app/renderContext/content/modules/paragraph/paragraph.resolve.renderContext.ts

import type { AppContextParagraphModule } from "@app/appContext/content/modules/paragraph/paragraph.module.appContext.types";
import type { RenderContextParagraphModule } from "@app/renderContext/content/modules/paragraph/paragraph.module.renderContext.types";

import { resolveInlineContentRenderContext } from "@app/appContext/content/inline-content/inline-content.resolve.renderContext";

export const resolveParagraphRenderContext = (
  module: AppContextParagraphModule,
): RenderContextParagraphModule => {
  return {
    kind: "paragraph",
    flow: "content",
    content: resolveInlineContentRenderContext(module.content),
  };
};
