// src/app-render-context/resolve/body-content/block/paragraph.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextParagraphBlockContentModule } from "@shared-types/page-content/block/paragraph/app-context.paragraph.block.page-content.types";
import type { AppRenderContextParagraphBlockContentModule } from "@shared-types/page-content/block/paragraph/app-render-context.paragraph.block.page-content.types";

import { resolveInlineContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context";

export const resolveParagraphBlockContentModuleAppRenderContext = (
  appContext: AppContext,
  module: AppContextParagraphBlockContentModule,
): AppRenderContextParagraphBlockContentModule => {
  return {
    ...module,
    content: module.content.map((item) =>
      resolveInlineContentModuleAppRenderContext(appContext, item),
    ),
  };
};
